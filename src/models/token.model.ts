import { Column, DataType, ForeignKey, Table, Model } from 'sequelize-typescript';
import { Users } from 'src/users/users.model';
import { Comand } from './comand.model';

interface TokenAtributes{
    id:number;
    userId:number;
    token:string;
}

@Table({ tableName:'tokens', timestamps:false})
export class Token extends Model<Token,TokenAtributes>{
    @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
    id:number;

    @ForeignKey(()=>Users)
    @Column({type: DataType.INTEGER})
    userId:number;

    @Column({type: DataType.STRING})
    token:string;
}