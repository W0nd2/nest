import { Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/users/user-extends';
import { Users } from 'src/users/users.model';
import { AllMembers } from './dto/all-members.dto';
import { ChangeTeam } from './dto/change-team.dto';
import { JoinTeam } from './dto/join-team.dto';
import { TeamMembers } from './dto/team-members.dto';
import { TeamService } from './team.service';

@Controller('team')
export class TeamController {
    constructor(private teamService: TeamService){}
    // -------- TEAM --------

    // ОТПРАВКА ЗАЯВКИ НА ВСТУПЛЕНИЕ В КОМАНДУ ПОЛЬЗОВАТИЛЕМ
    @UseGuards(AuthGuard)
    @Post('/newTeamMember')
    async newTeamMember(@User() user: Users,@Body() joinTeam:JoinTeam)
    {
        const id = user.id
        try {
            let result = await this.teamService.newMember(id,joinTeam.comandId)
            return result;
        } catch (error) {
            console.log(error)
            throw new HttpException(`${error}`,HttpStatus.BAD_REQUEST);
        }
    }

    // ОТМЕНА ЗАЯВКИ НА ВСТУПЛНЕНИЕ В КОМАНДУ ПОЛЬЗОВАТИЛЕМ
    @UseGuards(AuthGuard)
    @Delete('/declineQueue')
    async declineQueue(@User() user: Users){
        const id = user.id
        try {
            let queue = await this.teamService.declineQueue(id)
            return {message:`Пользователь ${id} удален с очереди`, queue}
        } catch (error) {
            console.log(error)
            throw new HttpException(`${error}`,HttpStatus.BAD_REQUEST);
        }
    }

    // Переход в другую каманду
    @UseGuards(AuthGuard)
    @Post('/memberToAnotherTeam')
    async changeComand(@User() user: Users, @Body() changeTeam:ChangeTeam){
        const id = user.id;
        try {
            let queue = await this.teamService.changeComand(id, Number(changeTeam.comandId));
            return queue;
        } catch (error) {
            console.log(error);
            throw new HttpException(`${error}`,HttpStatus.BAD_REQUEST);
        }
    }

    //ИНФОРМАЦИЯ ПРО ИГРОКОВ В ОДНОЙ КОМАНДЕ
    @UseGuards(AuthGuard)
    @Post('/teamMembers')
    async teamMembers(@Query() query:TeamMembers){
        try {
            let team = await this.teamService.teamMembers(Number(query.comandId),Number(query.userLimit), Number(query.offsetStart));
            return team;
        } catch (error) {
            console.log(error)
            throw new HttpException(`${error}`,HttpStatus.BAD_REQUEST);
        }
    }

    // ВСЕ УЧАСНИКИ С ДВУХ КОМАНД
    @UseGuards(AuthGuard)
    @Get('/allMembers')
    async allMembers(@Query() query:AllMembers){
        try {
            let teams = await this.teamService.allMembers(Number(query.userLimit), Number(query.offsetStart))
            return teams
        } catch (error) {
            console.log(error)
            throw new HttpException(`${error}`,HttpStatus.BAD_REQUEST);
        }
    }

    // @UseGuards(AuthGuard)
    // @Get('/membersOncomand')
    // async getmembers(){
    //     try {
    //         const {userLimit, offsetStart} = req.query;
    //         const {id} = req.body;
    //         const members = await this.adminService.getmembers(id,Number(userLimit), Number(offsetStart))
    //         return {members,total:members.length}
    //     } catch (error) {
    //         console.log(error);
    //         throw new HttpException(`${error}`,HttpStatus.BAD_REQUEST);
    //     }
    // }
}
