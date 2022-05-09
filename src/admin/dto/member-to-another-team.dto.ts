import { IsNumber } from "class-validator";

export class MemberToAnTeam{
    @IsNumber({},{message:"Формат должен быть числом"})
    readonly userId:number;
    @IsNumber({},{message:"Формат должен быть числом"})
    readonly comandId:number;
}