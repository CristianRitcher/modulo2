import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { IsOptional, IsString } from 'class-validator';


export class CreateUserDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name: string;

  @IsEmail({}, { message: 'Correo inválido' })
  email: string;

  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsOptional()
  @IsString()
  role?: string;

}