import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Banlist } from 'src/models/banlist.model';
import { Users } from 'src/users/users.model';

@Injectable()
export class BlockService {
    async blockUser(id:number, reason: string, blockFlag: boolean):Promise<Banlist>{
        let user = await Users.findOne({where:{id}})
        if (!user) {
            throw new HttpException('Пользователя с таким id не существует',HttpStatus.NOT_FOUND);
        }
        let blockedUser = await Banlist.findOne({where:{userId:user.id}})
        if(blockedUser.isBlocked == blockFlag)
        {
            throw new HttpException('Пользователь уже находиться в блокировке или разблокирован',HttpStatus.NOT_FOUND);
        }
        blockedUser.isBlocked = blockFlag;
        blockedUser.reason = reason;
        blockedUser.save();
        return blockedUser;
    }
    
    async isBlocked(id:number):Promise<boolean>{
        let user = await Banlist.findOne({where: {userId: id}})
        if(!user){
            throw new HttpException('Пользователя с таким id не существует',HttpStatus.NOT_FOUND);
        }
        return user.isBlocked
    }
}