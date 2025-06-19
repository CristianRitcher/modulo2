import { 
    registerDecorator, 
    ValidationOptions, 
    ValidatorConstraint, 
    ValidatorConstraintInterface 
} from "class-validator";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateAccount } from "src/create-account/entities/create-account.entity";

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
    constructor(
        @InjectRepository(CreateAccount)
        private readonly createAccountRepository: Repository<CreateAccount>
    ) {}

    async validate(value: any, args: any) {
        const entity = await this.createAccountRepository.findOneBy({ 
            [args.property]: value 
        });
        return !entity;
    }

    defaultMessage(args: any) {
        return `${args.property} ya está registrado`;
    }
}

export function IsUnique(
    entity: any,
    validationOptions?: ValidationOptions
) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [entity],
            validator: IsUniqueConstraint,
        });
    };
}