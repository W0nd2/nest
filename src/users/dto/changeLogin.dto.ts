import { IsString, Length } from "class-validator";

export class changeLoginDto {
    @IsString({message:"Формат должен быть строкой"})
    @Length(4,20,{message:"Login должен быть от 4 до 20 символов"})
    readonly newLogin:string;
}