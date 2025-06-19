import { Module } from '@nestjs/common';
import { CreateAccountService } from './create-account.service';
import { CreateAccountController } from './create-account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateAccount } from './entities/create-account.entity';
import { EnviarCorreosService } from 'src/enviar-correos/enviar-correos.service';
import { IsUniqueConstraint } from 'src/decorators/is-unique.decorator';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([CreateAccount]),
    ConfigModule
  ],
  controllers: [CreateAccountController],
  providers: [
    CreateAccountService,
    EnviarCorreosService,
    IsUniqueConstraint
  ],
  exports: [CreateAccountService]
})
export class CreateAccountModule {}