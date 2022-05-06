import { Column, DataType, ForeignKey, Table, Model } from 'sequelize-typescript';
import { Users } from '../models/users.model';
import { Comand } from './comand.model';

interface UserComandAtributes{
    id:number;
    userId:number;
    comandId:number;
}

@Table({ tableName:'userComands', timestamps:false})
export class UserComand extends Model<UserComand,UserComandAtributes>{
    @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
    id:number;

    @ForeignKey(()=>Users)
    @Column({type: DataType.INTEGER})
    userId:number;

    @ForeignKey(()=>Comand)
    @Column({type: DataType.INTEGER})
    comandId:number;
}