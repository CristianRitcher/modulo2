// src/password-recovery/password-recovery.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { PasswordRecoveryService } from './password-recovery.service';
import { Public } from '../decorators/public.decorator'; // ← importa tu decorador

@Controller('password-recovery')
export class PasswordRecoveryController {
  constructor(private readonly service: PasswordRecoveryService) {}

  @Public()
  @Post('request')
  async requestReset(@Body('correo') correo: string) {
    await this.service.requestPasswordReset(correo);
    return { message: 'Código enviado al correo' };
  }

  @Public()
  @Post('verify')
  async verify(@Body('correo') email: string, @Body('token') token: string) {
    await this.service.verifyRecoveryToken(email, token);
    return { valid: true, message: 'Código válido' };
  }

  @Public()
  @Post('reset')
  async resetPassword(
    @Body('correo') email: string,
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    await this.service.resetPassword(email, token, newPassword);
    return { message: 'Contraseña actualizada' };
  }
}
