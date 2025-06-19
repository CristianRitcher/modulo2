import { IsOptional, IsString } from 'class-validator';

export class UpdateCreateAccountDto {
    @IsOptional()
    @IsString()
    name?: string;
}