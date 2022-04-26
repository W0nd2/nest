import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table } from "sequelize-typescript";
import { AproveList } from "../models/aprove-list.model";
import { Banlist } from "src/models/banlist.model";
import { Roles } from "../models/roles.model";
import { UserComand } from "../models/user-comand.model";
import { Comand } from "src/models/comand.model";

interface UserAtributes{
    id:number;
    email:string;
    login:string;
    password:string;
    avatar:string;
    roleId:number;
    accountType:string;
    managerActive:boolean;
}

@Table({ tableName:'users', timestamps:false})
export class Users extends Model<Users,UserAtributes>{
    @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
    id:number;

    @Column({type: DataType.STRING, unique: true})
    email:string;

    @Column({type: DataType.STRING, allowNull: false,})
    login:string;

    @Column({type: DataType.STRING, allowNull: true})
    password:string;

    @Column({type: DataType.STRING})
    avatar:string;

    @ForeignKey(()=>Roles)
    @Column({type: DataType.INTEGER, defaultValue:1})
    roleId:number;

    @Column({type: DataType.STRING, defaultValue:"common"})
    accountType:string;
    
    @Column({type: DataType.BOOLEAN, defaultValue:"false"})
    managerActive:boolean;

    @BelongsTo(()=>Roles)
    roles: Roles;

    @HasOne(()=>AproveList)
    aproveList:AproveList;

    @HasMany(()=>Banlist)
    banlist: Banlist[];

    @BelongsToMany(()=> Comand, ()=> UserComand)
    comands: Comand[];
}