import { IsNumber } from "class-validator";

export class ChangeTeam {
    @IsNumber({},{message:"Формат должен быть числом"})
    readonly comandId:number;
}