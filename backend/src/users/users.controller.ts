import { Body, Controller, Get, NotFoundException, Post, Query, UseGuards, }
  from '@nestjs/common';
import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Public } from '../decorators/public.decorator';


@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {
    console.log('✅ UsersController cargado');
  }

  @Get()
  @Roles('admin')
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Public()
  @Get('verify')
  async verifyUser(@Query('token') token: string): Promise<{ message: string }> {
    const user = await this.usersService.verifyByToken(token);
    if (!user) {
      throw new NotFoundException('Token inválido o ya usado');
    }
    return { message: 'Usuario verificado correctamente' };
  }

  @Public()
  @Post()
  async create(@Body() dto: CreateUserDto): Promise<User> {
    return this.usersService.create(dto);
  }

  @Public()
  @Post('resend-verification')
  async resendVerification(@Body('email') email: string): Promise<{ message: string }> {
    await this.usersService.resendVerificationEmail(email);
    return { message: 'Correo de verificación reenviado correctamente' };
  }
}
