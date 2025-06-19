import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCreateAccountDto } from './dto/create-create-account.dto';
import { UpdateCreateAccountDto } from './dto/update-create-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAccount } from './entities/create-account.entity';
import { Repository } from 'typeorm';
import { EnviarCorreosService } from 'src/enviar-correos/enviar-correos.service';
import { generateToken } from 'src/utils/token';
import { CheckCouponDto } from './dto/check-coupon.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CreateAccountService {
  constructor(
    @InjectRepository(CreateAccount) 
    private readonly createAccountRepository: Repository<CreateAccount>,
    private readonly emailService: EnviarCorreosService
  ) {}

  async create(createCreateAccountDto: CreateCreateAccountDto) {
    // Verificar si el usuario ya existe
    const existingUser = await this.createAccountRepository.findOneBy({
      email: createCreateAccountDto.email
    });
    
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    // Generar token de verificación
    const verificationToken = generateToken();
    const tokenExpiration = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    // Hashear la contraseña
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(createCreateAccountDto.password, saltRounds);

    // Crear el usuario
    const user = this.createAccountRepository.create({
      name: createCreateAccountDto.name.trim(),
      email: createCreateAccountDto.email,
      password_hash: passwordHash,
      is_verified: false,
      verification_token: verificationToken,
      token_expiration: tokenExpiration
    });

    await this.createAccountRepository.save(user);

    // Enviar email de confirmación
    await this.emailService.enviarConfirmacion({
      correo: createCreateAccountDto.email,
      token: verificationToken
    });

    return {
      message: "Usuario registrado correctamente. Se ha enviado un código de verificación a tu email",
      userId: user.id,
      ok: true
    };
  }

  async verifyEmail(token: string) {
    if (!token || token.trim() === '') {
      throw new BadRequestException('Token es requerido');
    }

    const user = await this.createAccountRepository.findOneBy({ 
      verification_token: token 
    });

    if (!user) {
      throw new NotFoundException('Token no válido');
    }

    if (user.token_expiration && user.token_expiration < new Date()) {
      throw new BadRequestException('El token ha expirado');
    }

    if (user.is_verified) {
      throw new BadRequestException('Esta cuenta ya ha sido verificada');
    }

    // Verificar el email y limpiar el token
    user.verification_token = null;
    user.token_expiration = null;
    user.is_verified = true;

    await this.createAccountRepository.save(user);

    return {
      message: 'Email verificado correctamente',
      userId: user.id,
      ok: true
    };
  }

  async resendVerificationEmail(email: string) {
    const user = await this.createAccountRepository.findOneBy({ email });
    
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (user.is_verified) {
      throw new BadRequestException('Esta cuenta ya ha sido verificada');
    }

    // Generar nuevo token
    const verificationToken = generateToken();
    const tokenExpiration = new Date(Date.now() + 60 * 60 * 1000);

    user.verification_token = verificationToken;
    user.token_expiration = tokenExpiration;

    await this.createAccountRepository.save(user);

    // Reenviar email
    await this.emailService.enviarConfirmacion({
      correo: email,
      token: verificationToken
    });

    return {
      message: 'Código de verificación reenviado',
      ok: true
    };
  }

  async getUserById(id: number) {
    const user = await this.createAccountRepository.findOneBy({ id });
    
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      is_verified: user.is_verified,
      created_at: user.created_at,
      updated_at: user.updated_at
    };
  }

  async findAll() {
    return this.createAccountRepository.find({
      select: ['id', 'name', 'email', 'is_verified', 'created_at', 'updated_at']
    });
  }

  async findOne(id: number) {
    return this.getUserById(id);
  }

  async update(id: number, updateCreateAccountDto: UpdateCreateAccountDto) {
    const user = await this.createAccountRepository.findOneBy({ id });
    
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Solo permitir actualizar el nombre si se proporciona
    if (updateCreateAccountDto.name) {
      user.name = updateCreateAccountDto.name.trim();
    }

    await this.createAccountRepository.save(user);

    return {
      message: 'Usuario actualizado correctamente',
      user: await this.getUserById(id),
      ok: true
    };
  }

  async remove(id: number) {
    const user = await this.createAccountRepository.findOneBy({ id });
    
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    await this.createAccountRepository.remove(user);

    return {
      message: 'Usuario eliminado correctamente',
      ok: true
    };
  }

  // Método para login (opcional, si lo necesitas)
  async validateUser(email: string, password: string) {
    const user = await this.createAccountRepository.findOneBy({ email });
    
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (!user.is_verified) {
      throw new BadRequestException('Debes verificar tu email antes de iniciar sesión');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      throw new BadRequestException('Credenciales inválidas');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      is_verified: user.is_verified
    };
  }
}