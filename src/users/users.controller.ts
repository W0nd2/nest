import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
    HttpException, 
    HttpStatus, 
    Inject, 
    Patch, 
    Post, 
    Query, 
    Req, 
    UploadedFile, 
    UseGuards, 
    UseInterceptors, 
    UsePipes
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from '../file/file.service';
import { ValidationPipe } from '../pipes/validation.pipe';
import { TeamService } from '../team/team.service';
import { AuthGuard } from '../guards/auth.guard';
import { AllMembers } from './dto/all-members.dto';
import { ChangeTeam } from './dto/change-team.dto';
import { changeLoginDto } from './dto/changeLogin.dto';
import { changePasswordDto } from './dto/changePassword.dto';
import { forgotPasswordDto } from './dto/forgotPassword.dto';
import { JoinTeam } from './dto/join-team.dto';
import { TeamMembers } from './dto/team-members.dto';
import { User } from './user-extends';
import { Users } from '../models/users.model';
import { UsersService } from './users.service';
import { IUsersService } from './users.inteface';

@Controller('api/user')
export class UsersController {

    constructor(
        @Inject('IUsersService') private userService:IUsersService,
        //private userService: UsersService,
        private fileService: FileService,
        private teamService: TeamService
    ){}

    @Post('/password/change')
    async changePassword(@Body() changePasswordDto:changePasswordDto){
        try {
            let message = await this.userService.changePassword(changePasswordDto.email);
            return message;
        } catch (error) {
            console.log(error)
            throw new HttpException(`${error}`,HttpStatus.BAD_REQUEST);
        }
    }

    @UsePipes(ValidationPipe)
    @Patch('/password')
    async forgotPassword(@Body() forgotPasswordDto:forgotPasswordDto){
        try {
            let message = await this.userService.forgotPassword(forgotPasswordDto.password, forgotPasswordDto.token);
            return message;
        } catch (error) {
            console.log(error)
            throw new HttpException(`${error}`,HttpStatus.BAD_REQUEST);
        }
    }

    @UseGuards(AuthGuard)
    @Get('/profile')
    async profile(@User() user: Users){
        const id = user.id;
        try {
            if(!id)
            {
                throw new HttpException('???????????????????????? ???? ???????????? ??????????????????????',HttpStatus.UNAUTHORIZED);
            }
            let user = await this.userService.checkProfile(id)
            return user
        } catch (error) {
            console.log(error)
            throw new HttpException(`${error}`,HttpStatus.BAD_REQUEST);
        }
    }

    @UsePipes(ValidationPipe)
    @UseGuards(AuthGuard)
    @Patch('/login/change')
    async changeLogin(
        @User() user: Users,
        @Body() changeLoginDto:changeLoginDto
    ){
        const id = user.id;
        try {
            if(!id)
            {
                throw new HttpException('???????????????????????? ???? ???????????? ??????????????????????',HttpStatus.UNAUTHORIZED);
            }
            let user = await this.userService.changeLogin(id, changeLoginDto.newLogin)
            return user
        } catch (error) {
            console.log(error)
            throw new HttpException(`${error}`,HttpStatus.BAD_REQUEST);
        }
    }

    @UseGuards(AuthGuard)
    @Patch('/avatar/change')
    @UseInterceptors(FileInterceptor('avatar'))
    async changeAvatar(
        @User() user: Users,
        @UploadedFile() avatar,
    ){
        let fileName = await this.fileService.uploadFile(avatar);
        let newUser = await this.userService.changeAvatar(user.id,fileName)
        return newUser
    }

    // ???????????????? ???????????? ???? ???????????????????? ?? ?????????????? ??????????????????????????
    @UseGuards(AuthGuard)
    @Post('/newTeamMember')
    async newTeamMember(
        @User() user: Users,
        @Body() joinTeam:JoinTeam
    ){
        const id = user.id
        try {
            let result = await this.teamService.newMember(id,joinTeam.comandId)
            return result;
        } catch (error) {
            console.log(error)
            throw new HttpException(`${error}`,HttpStatus.BAD_REQUEST);
        }
    }

    // ???????????? ???????????? ???? ?????????????????????? ?? ?????????????? ??????????????????????????
    @UseGuards(AuthGuard)
    @Delete('/declineQueue')
    async declineQueue(@User() user: Users){
        const id = user.id
        try {
            let queue = await this.teamService.declineQueue(id)
            return {message:`???????????????????????? ${id} ???????????? ?? ??????????????`, queue}
        } catch (error) {
            console.log(error)
            throw new HttpException(`${error}`,HttpStatus.BAD_REQUEST);
        }
    }

    // ?????????????? ?? ???????????? ??????????????
    @UseGuards(AuthGuard)
    @Post('/memberToAnotherTeam')
    async changeComand(
        @User() user: Users, 
        @Body() changeTeam:ChangeTeam
    ){
        const id = user.id;
        try {
            let queue = await this.teamService.changeComand(id, Number(changeTeam.comandId));
            return queue;
        } catch (error) {
            console.log(error);
            throw new HttpException(`${error}`,HttpStatus.BAD_REQUEST);
        }
    }

    //???????????????????? ?????? ?????????????? ?? ?????????? ??????????????
    @UseGuards(AuthGuard)
    @Get('/teamMembers')
    async teamMembers(@Query() query:TeamMembers){
        try {
            let team = await this.teamService.teamMembers(Number(query.comandId),Number(query.userLimit), Number(query.offsetStart));
            return team;
        } catch (error) {
            console.log(error)
            throw new HttpException(`${error}`,HttpStatus.BAD_REQUEST);
        }
    }

    // ?????? ???????????????? ?? ???????? ????????????
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
}
