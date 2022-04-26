import { IsEmail, IsString } from "class-validator";

export class changePasswordDto{
    @IsString({message:"Формат должен быть строкой"})
    @IsEmail({},{message:"Не корректный email"})
    readonly email:string;
}