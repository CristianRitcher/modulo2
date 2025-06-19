import { IsNotEmpty, MinLength, Matches, IsString } from "class-validator";

export class CompletePasswordDto{
    @IsNotEmpty({message:'La contraseña es obligatoria'})
    @IsString()
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*/, { 
        message: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número' 
    })
    password:string
}