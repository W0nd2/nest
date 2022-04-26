import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Comand } from 'src/models/comand.model';
import { RequestComand } from 'src/models/request-comand.model';
import { UserComand } from 'src/models/user-comand.model';
import { Users } from 'src/users/users.model';

@Injectable()
export class TeamService {
    async newMember(userId:number, comandId: number):Promise<RequestComand>{
        let status ='pending';
        let user = await RequestComand.findOne({where: {userId,status}});
        let userInComand = await UserComand.findOne({where: {userId}});
        let comand = await Comand.findOne({where: {id:comandId}});
        // let flag = await blockService.isBlocked(userId)
        // if(flag){
            // return ApiError.internal('Пользователь заблокирован')
        // }
        if(user)
        {
            throw new HttpException('Пользователь с таки ID уже состоит в очереди',HttpStatus.FORBIDDEN);
        }
        if(userInComand){
            throw new HttpException('Пользователь уже находиться в команде',HttpStatus.FORBIDDEN);
        }
        if(!comand)
        {
            throw new HttpException('Данной команды не существует',HttpStatus.NOT_FOUND);
        }
        
        let queue = await RequestComand.create({userId, comandId})
        return queue;
    }

    async declineQueue(userId:number):Promise<string>{
        let user = await RequestComand.findOne({where:{userId}});
        if(!user){
            throw new HttpException('Пользователь с таким ID не состоит в очереди',HttpStatus.NOT_FOUND);
        }
        RequestComand.destroy({where:{userId}});
        let message = 'Пользователь удален с очереди';
        return message;
    }

    async teamMembers(comandId:number, userLimit:number, offsetStart:number):Promise<Comand[]>{
        let teamMembers =await Comand.findAll({
            where:{id:comandId},
            include:[{model:Users,attributes: { exclude: ['password']}}],
            limit: userLimit,
            offset: offsetStart
        })
        if(teamMembers.length == 0){
            throw new HttpException('Команда пуста',HttpStatus.FORBIDDEN);
        }
        return teamMembers;
    }
}
