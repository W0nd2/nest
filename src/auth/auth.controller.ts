import { Body, Controller, HttpCode, HttpStatus, Post, Req, UsePipes } from '@nestjs/common';
import { Request } from 'express';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("/registration")
    @HttpCode(HttpStatus.CREATED)
    async registration(@Body() userDto:CreateUserDto){
        let message = await this.authService.registretion(userDto)
        return {message};
    }

    @Post("/login")
    async login(@Body() userDto:LoginUserDto){
        let token = await this.authService.login(userDto);
        return {token};
    }
}
