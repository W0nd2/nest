import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Users } from '../models/users.model'
import { CreateUserDto } from './dto/create-user.dto';
import {LoginUserDto} from './dto/login-user.dto'
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Roles } from '../models/roles.model';
import { Banlist } from '../models/banlist.model';
import { AproveList } from '../models/aprove-list.model';
import { IAuthService } from './auth.interface';

@Injectable()
export class AuthService implements IAuthService{
    constructor(private jwtService: JwtService) {}

    async registretion(dto: CreateUserDto): Promise<string>{
        const candidate = await Users.findOne({ where: { email: dto.email } })
        if (candidate) {
            throw new HttpException('Пользователь с таким email уже существует',HttpStatus.BAD_REQUEST);
        }
        const hashPassword = await bcrypt.hash(dto.password, 5);
        const user = await Users.create({ email: dto.email, password: hashPassword, login: dto.login, roleId: dto.role})
        await Banlist.create({ userId: user.id })
        if (dto.role == 2) {
            await AproveList.create({ userId: user.id })
        }
        return 'Пользователь успешно зареистрирован';
    }

    async login(dto: LoginUserDto): Promise<string>{
        const user = await Users.findOne({where: { email:dto.email }});
        if(!user){
            throw new HttpException('Пользователь не зареестрирован',HttpStatus.NOT_FOUND);
        }
        if (user.accountType === 'Google') {
            throw new HttpException('Пользователь зареистрированый',HttpStatus.NOT_ACCEPTABLE);
        }
        if(user.roleId == 2 && !user.managerActive)
        {
            throw new HttpException('Администратор ещё не подтвержил вашу заявку',HttpStatus.BAD_REQUEST);
        }
        let comparePassword = bcrypt.compareSync(dto.password, user.password)
        if (!comparePassword) {
            throw new HttpException('Неверный пароль',HttpStatus.BAD_REQUEST);
        }
        const role = await Roles.findOne({where: { id: user.roleId}})
        let token = this.jwtService.sign({id:user.id,email:user.email,login:user.login,role:role.userRole});
        return token;
    }

    async googleLogin(req) {
        if (!req.user) {
            throw new HttpException('Неверный пароль',HttpStatus.BAD_REQUEST);
        }
        let user =  await Users.findOne({where: { email: req.user.email }});
        if(!user){
            user = await Users.create({ email: req.user.email, login: req.user.firstName, roleId: 1,accountType:'Google'});
            await Banlist.create({ userId: user.id });
        }
        const role = await Roles.findOne({where: { id: user.roleId}})
        let token = this.jwtService.sign({id:user.id,email:user.email,login:user.login,role:role.userRole});
        return token;
    }

}
