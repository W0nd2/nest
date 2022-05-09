import { IsNumber } from "class-validator";

export class MemberToTeam{
    @IsNumber({},{message:"Формат должен быть числом"})
    readonly reqId: number;
    readonly status: string;
}