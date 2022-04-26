import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
//import { CreateUserDto } from './dto/create-user.dto';
import { Users } from './users.model';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {

    constructor(private jwtService:JwtService) {}

    async checkProfile(id: number):Promise<Users>{
        const user = await Users.findOne({where: {id},attributes: { exclude: ['password']}})
        if(!user)
        {
            throw new HttpException('Пользователя с таким ID не существует',HttpStatus.NOT_FOUND);
        }
        return user
    }

    //LOGIN
    async changeLogin(id: number, newLogin: string):Promise<Users> {
        const user = await Users.findOne({ where: { id },attributes: { exclude: ['password']}})
        if (!user) {
            throw new HttpException('Пользователя с таким ID не существует',HttpStatus.NOT_FOUND);
        }
        user.login = newLogin;
        await user.save();
        return user;
    }

    //AVATAR
    async changeAvatar(id: number, fileName: string):Promise<Users> {
        const user = await Users.findOne({ where: { id },attributes: { exclude: ['password']}})
        if (!user) {
            throw new HttpException('Пользователя с таким ID не существует',HttpStatus.NOT_FOUND);
        }
        user.avatar=fileName;
        await user.save();
        return user;
    }

    //PASSWORD

    async forgotPassword(newPassword: string, token: string):Promise<string>{
        //let userToken = jwtService.decodeJWT(token)
        let message = 'Пользователь сменил пароль';
        let id:number 
        //if(typeof userToken == 'object'){
           // id= userToken.id
        //}
        let user = await Users.findOne({ where: { id }})
        if (!user) {
            throw new HttpException('Пользователя с таким ID не существует',HttpStatus.NOT_FOUND);
        }
        const hashPassword = await bcrypt.hash(newPassword, 5);
        user.password = hashPassword;
        user.save();
        return message;
    }

    async changePassword(email: string):Promise<string> {
        let message = 'Письмо отправлено не почту';
        const user = await Users.findOne({where:{email}})
        if(!user){
            throw new HttpException('Пользователя с таким ID не существует',HttpStatus.NOT_FOUND);
        }
        const token = this.jwtService.sign({id:user.id,email:user.email,login:user.login});
        //mailService.sendMail(user.email, `http://127.0.0.1:5500/client/password.html#token=${token}`);
        return message;
    }
}
