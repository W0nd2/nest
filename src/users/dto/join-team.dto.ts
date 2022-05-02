import {IsString} from "class-validator";

export class JoinTeam {
    @IsString({message:"Формат должен быть строкой"})
    readonly comandId:number;
}