import { IsNumber } from "class-validator";

export class UserById{
    @IsNumber({},{message:"Формат должен быть числом"})
    readonly id:number;
}