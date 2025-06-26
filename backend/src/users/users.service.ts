import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { EmailService } from '../email/email.service';
import { UserRole } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly emailService: EmailService,
  ) { }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.usersRepository.findOne({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('El correo ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

    const user = this.usersRepository.create({
      name: dto.name,
      email: dto.email,
      passwordHash: hashedPassword,
      verification_token: verificationToken,
      token_expiration: expiresAt,
      is_verified: false,
      role: Object.values(UserRole).includes(dto.role as UserRole)
        ? (dto.role as UserRole)
        : UserRole.CLIENT,
    });


    const savedUser = await this.usersRepository.save(user);

    try {
      await this.emailService.sendVerificationEmail({
        to: dto.email,
        token: verificationToken,
      });
    } catch (error) {
      console.error('❌ Error al enviar correo:', error);
    }

    return savedUser;
  }

  async verifyByToken(token: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { verification_token: token },
    });

    if (!user) return null;

    const now = new Date();
    if (!user.token_expiration || user.token_expiration < now) {
      return null;
    }

    user.is_verified = true;
    user.verification_token = null;
    user.token_expiration = null;

    return this.usersRepository.save(user);
  }

  async resendVerificationEmail(email: string): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new ConflictException('Usuario no encontrado');
    }

    if (user.is_verified) {
      throw new ConflictException('El usuario ya está verificado');
    }

    const now = new Date();
    const shouldGenerateNewToken =
      !user.verification_token ||
      !user.token_expiration ||
      user.token_expiration < now;

    if (shouldGenerateNewToken) {
      const newToken = Math.floor(100000 + Math.random() * 900000).toString();
      user.verification_token = newToken;
      user.token_expiration = new Date(now.getTime() + 10 * 60 * 1000); // ⏱️ 10 minutos
      await this.usersRepository.save(user);
    }

    try {
      await this.emailService.sendVerificationEmail({
        to: user.email,
        token: user.verification_token!,
      });
    } catch (error) {
      console.error('❌ Error al reenviar correo:', error);
    }
  }

}