import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { EmailModule } from '../email/email.module';
import { VerificationWatcherService } from './verification-watcher.service';
import { EmailService } from '../email/email.service';


@Module({
  imports: [TypeOrmModule.forFeature([User]), EmailModule],
  controllers: [UsersController],
  providers: [UsersService, VerificationWatcherService, EmailService],
})
export class UsersModule {}
