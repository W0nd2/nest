import { Body, Controller, Get, HttpException, HttpStatus, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '../guards/auth.guard';
import { changeLoginDto } from './dto/changeLogin.dto';
import { changePasswordDto } from './dto/changePassword.dto';
import { forgotPasswordDto } from './dto/forgotPassword.dto';
import { User } from './user-extends';
//import { CreateUserDto } from './dto/create-user.dto';
import { Users } from './users.model';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(private userService: UsersService){}

    @UseGuards(AuthGuard)
    @Post('/password/change')
    async changePassword(@Body() changePasswordDto:changePasswordDto){
        try {
            let message = await this.userService.changePassword(changePasswordDto.email)
            return message
        } catch (error) {
            console.log(error)
            throw new HttpException(`${error}`,HttpStatus.BAD_REQUEST);
        }
    }

    @UseGuards(AuthGuard)
    @Patch('/password')
    async forgotPassword(@Body() forgotPasswordDto:forgotPasswordDto){

    }

    @UseGuards(AuthGuard)
    @Get('/profile')
    async profile(@User() user: Users){
        const id = user.id;
        try {
            if(!id)
            {
                throw new HttpException('Пользователь не прошел авторизацию',HttpStatus.UNAUTHORIZED);
            }
            let user = await this.userService.checkProfile(id)
            return user
        } catch (error) {
            console.log(error)
            throw new HttpException(`${error}`,HttpStatus.BAD_REQUEST);
        }
    }

    @UseGuards(AuthGuard)
    @Patch('/login/change')
    async changeLogin(@User() user: Users,@Body() changeLoginDto:changeLoginDto){
        const id = user.id;
        try {
            if(!id)
            {
                throw new HttpException('Пользователь не прошел авторизацию',HttpStatus.UNAUTHORIZED);
            }
            let user = await this.userService.changeLogin(id, changeLoginDto.newLogin)
            return user
        } catch (error) {
            console.log(error)
            throw new HttpException(`${error}`,HttpStatus.BAD_REQUEST);
        }
    }

    @UseGuards(AuthGuard)
    @Patch('/avatar/change')
    async changeAvatar(){
    }
}
