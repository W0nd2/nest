import { CreateUserDto } from "./dto/create-user.dto"
import { LoginUserDto } from "./dto/login-user.dto"

export interface IAuthService{
    registretion(dto: CreateUserDto): Promise<string>

    login(dto: LoginUserDto): Promise<string>

    googleLogin(req)
}