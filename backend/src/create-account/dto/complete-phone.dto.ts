import { IsNotEmpty, IsNumberString, Length } from "class-validator";

export class CompletePhoneDto {
    @IsNotEmpty({ message: 'El teléfono es obligatorio' })
    @IsNumberString({}, { message: 'El teléfono debe contener solo números' })
    @Length(10, 10, { message: 'El teléfono debe tener exactamente 10 dígitos' })
    telefono: string
}