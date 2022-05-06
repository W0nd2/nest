import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Users } from "../models/users.model";

interface BanlistAtributes{
    id:number;
    userId:number;
    isBlocked:boolean;
    reason:string;
}

@Table({ tableName:'banlists', timestamps:false})
export class Banlist extends Model<Banlist,BanlistAtributes>{
    @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
    id:number;

    @ForeignKey(()=>Users)
    @Column({type: DataType.INTEGER})
    userId:number;

    @Column({type: DataType.BOOLEAN, defaultValue:"false"})
    isBlocked:boolean;

    @Column({type: DataType.STRING})
    reason:string;
    
    @BelongsTo(()=>Users)
    users:Users[]
}