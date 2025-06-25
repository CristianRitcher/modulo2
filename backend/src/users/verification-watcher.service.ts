import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { EmailService } from '../email/email.service';

@Injectable()
export class VerificationWatcherService {
  private readonly logger = new Logger(VerificationWatcherService.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly emailService: EmailService,
  ) {}

  // 1. Limpia usuarios no verificados con token expirado cada 5 dias
  @Cron('0 0 * * *') // cada día a las 00:00
  async deleteOldUnverifiedUsers() {
    const now = new Date();
    const days = parseInt(process.env.USER_EXPIRE_DAYS || '3');
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const result = await this.usersRepository.delete({
      is_verified: false,
      createdAt: LessThan(cutoff),
    });

    if (result.affected && result.affected > 0) {
      this.logger.warn(`🗑️ Se eliminaron ${result.affected} usuarios no verificados tras ${days} días`);
    }
  }


  // 2. Reenvía verificación si el usuario no ha validado y el token aún está vigente
  @Cron('30 */15 * * * *') // a los 30 minutos de cada hora (10:30, 10:45...)
  async remindUnverifiedUsers() {
    const now = new Date();
    const threshold = new Date(now.getTime() - 5 * 60 * 1000); // registrados hace más de 5 minutos

    const users = await this.usersRepository.find({
      where: {
        is_verified: false,
        createdAt: LessThan(threshold),
        token_expiration: MoreThan(now),
      },
    });

    for (const user of users) {
      try {
        await this.emailService.sendVerificationEmail({
          to: user.email,
          token: user.verification_token!,
        });
        this.logger.log(`📨 Recordatorio enviado a: ${user.email}`);
      } catch (error) {
        this.logger.error(`❌ Falló reenvío a ${user.email}`, error.message);
      }
    }
  }
}
