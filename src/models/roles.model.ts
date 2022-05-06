import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Users } from "../models/users.model";

interface RolesAtributes{
    id:number;
    userRole:string;
}

@Table({ tableName:'roles', timestamps:false})
export class Roles extends Model<Roles,RolesAtributes>{
    @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
    id:number;

    @Column({type: DataType.STRING})
    userRole:string;

    @HasMany(()=> Users)
    users: Users[];
}