import { IsEmail, IsString, Length } from "class-validator";

export class CreateUserDto {
    @IsEmail({},{message:"Некорректный email"})
    readonly email:string;
    @IsString({message:"Формат должен быть строкой"})
    @Length(4,20,{message:"Login должен быть от 4 до 20 символов"})
    readonly login:string;
    @IsString({message:"Формат должен быть строкой"})
    @Length(5,20,{message:"Пароль должен быть от 5 до 20 символов"})
    readonly password:string;
    readonly role:number;
}