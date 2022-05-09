import { IsNumber } from "class-validator";

export class BlockUser{
    @IsNumber({},{message:"Формат должен быть числом"})
    readonly id:number;
    readonly reason:string;
    readonly blockFlag:boolean;
}