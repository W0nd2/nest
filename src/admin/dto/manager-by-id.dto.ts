import { IsNumber } from "class-validator";

export class ManagerById {
    @IsNumber({},{message:"Формат должен быть числом"})
    readonly id:number;
}