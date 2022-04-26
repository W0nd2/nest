import { Body, Controller, HttpException, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/users/user-extends';
import { Users } from 'src/users/users.model';
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
    @Post('/declineQueue')
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
    // async changeComand(req: express.Request, res: express.Response, next: express.NextFunction){
    //     try {
    //         const id = req.user.id
    //         const{comandId} = req.body
    //         let queue = await teamService.changeComand(id, comandId)
    //         return res.json(queue)
    //     } catch (error) {
    //         console.log(error)
    //         return ApiError.internal(error);
    //     }
    // }

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
    // async allMembers(req: express.Request, res: express.Response, next: express.NextFunction){
    //     try {
    //         const {userLimit, offsetStart} = req.query;
    //         let teams = await teamService.allMembers(Number(userLimit), Number(offsetStart))
    //         return res.json(teams)
    //     } catch (error) {
    //         console.log(error)
    //         return ApiError.internal(error);
    //     }
    // }

    // async getMember(req: express.Request, res: express.Response, next: express.NextFunction){
    //     try {
    //         let userId = req.user.id
    //         let teams = await teamService.getMember(userId)
    //         return res.json({teams})
    //     } catch (error) {
    //         console.log(error)
    //         return ApiError.internal(error);
    //     }
    // }
}
