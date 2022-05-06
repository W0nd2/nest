import { BelongsToMany, Column, DataType, HasOne, Model, Table } from "sequelize-typescript";
import { Users } from "../models/users.model";
import { RequestComand } from "./request-comand.model";
import { UserComand } from "./user-comand.model";

interface ComandAtributes{
    id:number;
    comandName:string;
}

@Table({ tableName:'comands', timestamps:false})
export class Comand extends Model<Comand,ComandAtributes>{
    @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
    id:number;

    @Column({type: DataType.STRING})
    comandName:string;

    @HasOne(()=> RequestComand)
    requestComand: RequestComand;

    @BelongsToMany(()=> Users, ()=> UserComand)
    users: Users[];
}

