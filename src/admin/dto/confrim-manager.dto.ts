import { IsNumber } from "class-validator";

export class ConfirmManager{
    @IsNumber({},{message:"Формат должен быть числом"})
    readonly id: number;
    readonly reason: string;
}