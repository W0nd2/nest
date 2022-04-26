import { IsString, Length } from "class-validator";

export class forgotPasswordDto{
    @IsString({message:"Формат должен быть строкой"})
    @Length(4,20,{message:"Login должен быть от 4 до 20 символов"})
    readonly password:string;
    @IsString({message:"Формат должен быть строкой"})
    readonly token:string;
}