import { IsNumber } from "class-validator";

export class DeclineToAnotherTeam{
    @IsNumber({},{message:"Формат должен быть числом"})
    readonly userId: number;
}