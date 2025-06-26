import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordRecoveryService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly mailer: EmailService,
  ) {}

  /**
   * Genera un token numérico de longitud dada.
   */
  private generateNumericToken(length = 6): string {
    let token = '';
    for (let i = 0; i < length; i++) {
      token += Math.floor(Math.random() * 10).toString();
    }
    return token;
  }

  /**
   * 1) Genera y guarda token + expiración,
   * 2) envía correo con token de recuperación.
   */
  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new NotFoundException('Email no registrado');

    const token = this.generateNumericToken(6);
    const expiration = new Date(Date.now() + 10 * 60 * 1000); // +10 minutos

    const { affected } = await this.userRepo.update(
      { email },
      {
        verification_token: token,
        token_expiration: expiration,
      },
    );
    if (!affected) throw new NotFoundException('No se pudo guardar el token');

    await this.mailer.sendVerificationEmail({ to: email, token });
  }

  /**
   * Verifica la validez del token de recuperación (sin borrar datos).
   */
  async verifyRecoveryToken(email: string, token: string): Promise<void> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (
      !user ||
      user.verification_token !== token ||
      !user.token_expiration ||
      user.token_expiration < new Date()
    ) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  /**
   * 1) Valida el token,
   * 2) actualiza la contraseña y limpia token + expiración.
   */
  async resetPassword(
    email: string,
    token: string,
    newPassword: string,
  ): Promise<void> {
    // 1) Verificación del token sin eliminarlo
    await this.verifyRecoveryToken(email, token);

    // 2) Hash de la nueva contraseña y actualización de la entidad
    const hashed = await bcrypt.hash(newPassword, 10);
    await this.userRepo.update(
      { email },
      {
        passwordHash: hashed,
        verification_token: null,
        token_expiration: null,
      },
    );
  }
}
