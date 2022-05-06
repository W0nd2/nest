import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { ValidationEcxeption } from "../exception/validation.exception";


@Injectable()
export class ValidationPipe implements PipeTransform<any>{
    async transform(value: any, metadata: ArgumentMetadata): Promise<any>{
        const obj = plainToClass(metadata.metatype,value);
        const errors = await validate(obj);
        if (errors.length != 0){
            let messages = errors.map(err =>{
                return `${err.property} - ${Object.values(err.constraints).join(',')}`;
            })
            throw new ValidationEcxeption(messages)
        }
        return value;
    }
}