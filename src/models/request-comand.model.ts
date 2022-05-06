import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Users } from "../models/users.model";
import { Comand } from "./comand.model";

interface requestComandAtributes{
    id:number;
    userId:number;
    comandId:number;
    status:string;
    type:string;
}

@Table({ tableName:'requestComands', timestamps:false})
export class RequestComand extends Model<RequestComand,requestComandAtributes>{
    @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
    id:number;

    @ForeignKey(()=>Users)
    @Column({type: DataType.INTEGER})
    userId:number;

    @ForeignKey(()=>Comand)
    @Column({type: DataType.INTEGER})
    comandId:number;

    @Column({type: DataType.STRING, defaultValue:'pending'})
    status:string;

    @Column({type: DataType.STRING, defaultValue:'join team'})
    type:string;

    @BelongsTo(()=>Comand)
    comand:Comand;

    @BelongsTo(()=>Users)
    user:Users;
}