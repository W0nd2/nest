import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Post, Req, UseGuards, UsePipes } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ValidationPipe } from '../pipes/validation.pipe';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { IAuthService } from './auth.interface';

@Controller('api/auth')
export class AuthController {
    constructor(
        @Inject('IAuthService') private authService:IAuthService,
        //private authService: AuthService
    ) {}

    @Post("/registration")
    @UsePipes(ValidationPipe)
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

    @Get("/google")
    @UsePipes(ValidationPipe)
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) { }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req) {
        return await this.authService.googleLogin(req);
    }
}
