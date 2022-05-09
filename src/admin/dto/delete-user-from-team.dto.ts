import { IsNumber } from "class-validator";

export class DeleteUserFromTeam{
    @IsNumber({},{message:"Формат должен быть числом"})
    readonly userId:number;
}