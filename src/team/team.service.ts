import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BlockService } from '../block/block.service';
import { Comand } from '../models/comand.model';
import { RequestComand } from '../models/request-comand.model';
import { UserComand } from '../models/user-comand.model';
import { Users } from '../models/users.model';

@Injectable()
export class TeamService{

    constructor(private blockService: BlockService){}

    async newMember(userId:number, comandId: number):Promise<RequestComand>{
        let status ='pending';
        let user = await RequestComand.findOne({where: {userId,status}});
        let userInComand = await UserComand.findOne({where: {userId}});
        let comand = await Comand.findOne({where: {id:comandId}});
        let flag = await this.blockService.isBlocked(userId);
        if(flag){
            throw new HttpException('Пользователь заблокирован',HttpStatus.FORBIDDEN);
        }
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

    async allMembers(userLimit:number, offsetStart:number):Promise<Comand[]>{
        let members = await Comand.findAll({
            include:[{model:Users,attributes: { exclude: ['password']},through:{ attributes:[]}}],
            limit: userLimit,
            offset: offsetStart
        })
        return members;
    }

    async changeComand(userId:number, comandId: number):Promise<RequestComand>{
        let userInComand = await UserComand.findOne({where: {userId}})
        let comand = await Comand.findOne({where: {id:comandId}})
        let members = await UserComand.findAndCountAll({where:{comandId}})
        if(members.count == 10)
        {
            throw new HttpException('Команда, в которую вы хотите перейти, полностью укомплектована',HttpStatus.NOT_FOUND);
        }
        if(!userInComand)
        {
            throw new HttpException('Пользователь с таки ID не состоит в команде, вы не можете подать заяку на переход в другую команду',HttpStatus.NOT_FOUND);
        }
        if(!comand)
        {
            throw new HttpException('Данной команды не существует',HttpStatus.NOT_FOUND);
        }
        let queue = await RequestComand.create({userId, comandId})
        return queue;
    }
}
