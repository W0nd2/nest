import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AproveList } from 'src/models/aprove-list.model';
import { Comand } from 'src/models/comand.model';
import { RequestComand } from 'src/models/request-comand.model';
import { UserComand } from 'src/models/user-comand.model';
import { Users } from 'src/users/users.model';

@Injectable()
export class AdminService {
    async confirmManager(id: number, reason: string):Promise<Users> {
        let user = await Users.findOne({ where: { id },attributes: { exclude: ['password'] }  })
        if (!user) {
            throw new HttpException('Пользователя с таким id не существует',HttpStatus.FORBIDDEN);
        }
        if (user.roleId != 2) {
            throw new HttpException('Пользователь не являеться MANAGER',HttpStatus.FORBIDDEN);
        }
        if (user.managerActive) {
            throw new HttpException('Пользователь уже являеться MANAGER',HttpStatus.FORBIDDEN);
        }
        user.managerActive = true;
        let aprove = await AproveList.findOne({ where: { userId: id } });
        aprove.reason = reason;
        aprove.save()
        user.save()
        return user;
    }

    async declineManager(id: number, reason: string):Promise<Users>{
        let user = await Users.findOne({ where: { id },attributes: { exclude: ['password'] }  })
        if (!user) {
            throw new HttpException('Пользователя с таким email не существует',HttpStatus.FORBIDDEN);
        }
        if (user.roleId != 2) {
            throw new HttpException('Пользователь уже являеться MANAGER',HttpStatus.FORBIDDEN);
        }
        user.managerActive = false;
        user.save()
        return user;
    }
 
    async getManagerById(id: number):Promise<Users>{
        let manager = await Users.findOne({ where: { id },attributes: { exclude: ['password'] }  })
        if (!manager) {
            throw new HttpException('Пользователя с таким ID не существует',HttpStatus.NOT_FOUND);
        }
        if (manager.roleId != 2) {
            throw new HttpException('Пользователь не являеться MANAGER',HttpStatus.CONFLICT);
        }
        return manager
    }

    async getManagers(roleId: string, userLimit:number, offsetStart:number):Promise<Users[]> {
        let managers = await Users.findAll({ 
            where: { roleId },
            limit: userLimit,
            offset: offsetStart
        })
        return managers;
    }

    async getUserById(id: number):Promise<Users>{
        let user = await Users.findOne({ where: { id },attributes: { exclude: ['password'] } })
        if (!user) {
            throw new HttpException('Пользователя с таким ID не существует',HttpStatus.NOT_FOUND);
        }
        if (user.roleId == 2) {
            if (!user.managerActive) {
                throw new HttpException('Администратор ещё не подтвердил заявку на роль MANAGER',HttpStatus.FORBIDDEN);
            }
        }
        return user
    }

    async confirmMemberToAnTeam(userId:number, comandId: number):Promise<UserComand>{
        let user = await Users.findOne({where:{id:userId}})
        let userStatus ='pending';
        let userInReq = await RequestComand.findOne({where:{userId,status:userStatus}})
        let comand = await Comand.findOne({where: {id:comandId}})
        let members = await UserComand.findAndCountAll({
            where:{comandId}
        })
        if(members.count >= 10)
        {
            throw new HttpException('Команда полностью укомплектована',HttpStatus.NOT_FOUND);
        }
        if(!user)
        {
            throw new HttpException('Пользователя с таки ID не существует',HttpStatus.NOT_FOUND);
        }
        if(!userInReq)
        {
            throw new HttpException('Пользователь с таки ID не состоит в очереди, возможно его уже добавили в команду',HttpStatus.NOT_FOUND);
        }
        if(!comand)
        {
            throw new HttpException('Данной команды не существует',HttpStatus.NOT_FOUND);
        }
        await UserComand.destroy({where:{userId}})                    
        let newMember = await UserComand.create({userId, comandId})   
        userInReq.status = 'approve';
        userInReq.save();              
        return newMember;
    }

    async declineToAnotherTeam(userId:number):Promise<string>{
        let user = await Users.findOne({where:{id:userId}})
        if(!user)
        {
            throw new HttpException('Пользователя с таким ID не существует',HttpStatus.NOT_FOUND);
        }
        let userStatus ='pending';
        let userInReq = await RequestComand.findOne({where:{userId,status:userStatus}})
        if(!userInReq)
        {
            throw new HttpException('Пользователь с таки ID не состоит в очереди, возможно его уже добавили в команду',HttpStatus.NOT_FOUND);
        }
        userInReq.status = 'decline';
        userInReq.save();
        const message ='Пользователя не перенесли в другую команду, его заявка отклонена';
        return message;
    }
      
    async allQueue(userLimit:number, offsetStart:number):Promise<RequestComand[] >{
        let status = 'pending';
        let queue = await RequestComand.findAll({
            where: {status},
            include: [
                {model:Users,attributes: { exclude: ['password']}},{model:Comand}
            ],
            limit: userLimit,
            offset: offsetStart
        })
        return queue;
    }

    async getmembers(comandId:number,userLimit:number, offsetStart:number):Promise<UserComand[]>{
        let members = await UserComand.findAll({
            where: {comandId},
            include:[{model:Users,attributes: { exclude: ['password']},through:{ attributes:[]}}],
            limit: userLimit,
            offset: offsetStart
        })
        return members
    }

    async deleteUserFromTeam(userId:number):Promise<string>{
        let message = 'Пользователь был удален с команды'
        let user = await UserComand.destroy({where:{userId}})
        if(!user){
            throw new HttpException('Пользователя с таки ID не состоит в команде',HttpStatus.FORBIDDEN);
        }
        return message;
    }

    async memberToTeam(reqId:number, status:string):Promise<string>{
        let userStatus ='pending';
        let request = await RequestComand.findOne({where:{id:reqId,status:userStatus}});
        if(!request){
            throw new HttpException('Пользователя с таки ID не состоит в очереди',HttpStatus.FORBIDDEN);
        }
        else if(request.status != 'pending'){
            throw new HttpException(`Пользователь имеет статус ${request.status}, дальнейшая регистрация не возможна`,HttpStatus.FORBIDDEN);
        }
        if(status == 'approve')
        {
            request.status = status;
            request.save();
            await UserComand.create({userId: request.userId, comandId: request.comandId});
            return 'Пользователю одобрили заявку на регистрацию в команду';
        }
        else if(status == 'decline')
        {
            request.status = status;
            request.save();
            return 'Пользователю отклонили заявку на регистрацую в команде';
        }
        else{
            throw new HttpException(`Не верный статус.`,HttpStatus.FORBIDDEN);
        }
    }

    async getMember(id:number):Promise<Users>{
        let member =await Users.findOne({where: {id},include:Comand,attributes: { exclude: ['password'] } })
        return member
    }
}
