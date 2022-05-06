import { Users } from "../models/users.model"

export interface IUsersService{
    checkProfile(id: number):Promise<Users>

    changeLogin(id: number, newLogin: string):Promise<Users>

    changeAvatar(id: number, fileName: string):Promise<Users>

    forgotPassword(newPassword: string, token: string):Promise<string>

    changePassword(email: string):Promise<string> 
}