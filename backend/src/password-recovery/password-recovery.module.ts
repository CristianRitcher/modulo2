// src/password-recovery/password-recovery.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { User } from '../users/entities/user.entity';
import { PasswordRecoveryService } from './password-recovery.service';
import { PasswordRecoveryController } from './password-recovery.controller';
import { EmailModule } from '../email/email.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CacheModule.register({}), 
    EmailModule,
    UsersModule
  ],
  providers: [PasswordRecoveryService],
  controllers: [PasswordRecoveryController],
})
export class PasswordRecoveryModule {}
