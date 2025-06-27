import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Roles('admin')
  getHello(): string {
    return this.appService.getHello();
  }
}
