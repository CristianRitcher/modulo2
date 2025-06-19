import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from "class-validator";
import { IsUnique } from '../../decorators/is-unique.decorator';
import { CreateAccount } from '../entities/create-account.entity';

export class CreateCreateAccountDto {
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    @IsString()
    name: string;

    @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
    @IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
    @IsUnique(CreateAccount, { message: 'Este correo ya está registrado' })
    email: string;

    @IsNotEmpty({ message: 'La contraseña es obligatoria' })
    @IsString()
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*/, { 
        message: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número' 
    })
    password: string;
}