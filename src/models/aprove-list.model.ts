import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Users } from "../models/users.model";

interface AproveListAtributes{
    id:number;
    userId:number;
    reason:string;
}

@Table({ tableName:'aprovelists', timestamps:false})
export class AproveList extends Model<AproveList,AproveListAtributes>{
    @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
    id:number;

    @ForeignKey(()=>Users)
    @Column({type: DataType.INTEGER})
    userId:number;

    @Column({type: DataType.STRING})
    reason:string;

    @BelongsTo(()=>Users)
    users:Users
}