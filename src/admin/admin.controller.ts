import {
    Body,
    Controller, 
    Delete, 
    Get, 
    HttpException, 
    HttpStatus, 
    Patch, 
    Post, 
    Query, 
    UseGuards 
} from '@nestjs/common';
import { BlockService } from 'src/block/block.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/guards/role.decorator';
import { RoleGuard } from 'src/guards/role.guard';
import { User } from 'src/users/user-extends';
import { AdminService } from './admin.service';
import { AllManager } from './dto/all-managers.dto';
import { BlockUser } from './dto/block-user.dto';
import { ConfirmManager } from './dto/confrim-manager.dto';
import { DeclineManager } from './dto/decline-manager.dto';
import { DeclineToAnotherTeam } from './dto/decline-to-another-team.dto';
import { DeleteUserFromTeam } from './dto/delete-user-from-team.dto';
import { GetMember } from './dto/det-member.dto';
import { ManagerById } from './dto/manager-by-id.dto';
import { MemberToAnTeam } from './dto/member-to-another-team.dto';
import { MemberToTeam } from './dto/member-to-team.dto';
import { Queue } from './dto/queue.dto';
import { UserById } from './dto/user-by-id.dto';

enum Access {
    Manager ='MANAGER',
    Administrator ='ADMIN'
}

@Controller('api/admin')
export class AdminController {

    constructor(
        private adminService: AdminService,
        private blockService: BlockService
    ){}

    @Roles(Access.Administrator)
    @UseGuards(RoleGuard)
    @Patch('/confirmManager')
    async confirmManager(@Body() body:ConfirmManager){
        try {
            let user = await this.adminService.confirmManager(Number(body.id),body.reason);
            return user;
        } catch (error) {
            console.log(error)
            throw new HttpException(`${error}`,HttpStatus.BAD_REQUEST);
        }
    }

    @Roles(Access.Administrator)
    @UseGuards(RoleGuard)
    @Patch('/decline')
    async declineManager(@Body() body:DeclineManager){
        try {
            let user = await this.adminService.declineManager(Number(body.id),body.reason);
            return user;
        } catch (error) {
            console.log(error)
            throw new HttpException(`${error}`,HttpStatus.BAD_REQUEST);
        }
    }

    @Roles(Access.Administrator)
    @UseGuards(RoleGuard)
    @Get('/managerByID')
    async getManagerById(@Query() query:ManagerById){
        try {
            let manager = await this.adminService.getManagerById(Number(query.id));
            return manager;
        } catch (error) {
            console.log(error)
            throw new HttpException(`${error}`,HttpStatus.BAD_REQUEST);
        }
    }

    @Roles(Access.Administrator)
    @UseGuards(RoleGuard)
    @Get('/allManagers')
    async getManagers(@Query() query:AllManager){
        try {
            const roleId = 2
            let managers = await this.adminService.getManagers(String(roleId),Number(query.userLimit), Number(query.offsetStart));
            return managers;
        } catch (error) {
            console.log(error);
            throw new HttpException(`${error}`,HttpStatus.BAD_REQUEST);
        }
    }

    @Roles(Access.Administrator,Access.Manager)
    @UseGuards(RoleGuard)
    @Patch('/unblockUser')
    async blockUser(@Body() body:BlockUser){
        try {
            let block = await this.blockService.blockUser(Number(body.id),body.reason,body.blockFlag);
            return block
        } catch (error) {
            console.log(error);
            throw new HttpException(`${error}`,HttpStatus.BAD_REQUEST);
        }
    }
    
    @Roles(Access.Administrator,Access.Manager)
    @UseGuards(RoleGuard)
    @Get('/userById')
    async getUserById(@Query() query:UserById) {
        try {
            let user = await this.adminService.getUserById(Number(query.id))
            return user
        } catch (error) {
            console.log(error);
            throw new HttpException(`${error}`,HttpStatus.BAD_REQUEST);
        }
    }

    @Roles(Access.Administrator,Access.Manager)
    @UseGuards(RoleGuard)
    @Post('/confirmToAnotherTeam')
    async confirmToAnotherTeam(@Body() body:MemberToAnTeam){
        try {
            let newTeamMember = await this.adminService.confirmMemberToAnTeam(Number(body.userId), Number(body.comandId));
            return newTeamMember;
        } catch (error) {
            console.log(error);
            throw new HttpException(`${error}`,HttpStatus.BAD_REQUEST);
        }
    }

    @Roles(Access.Administrator,Access.Manager)
    @UseGuards(RoleGuard)
    @Post('/declineToAnotherTeam')
    async declineToAnotherTeam(@Body() body:DeclineToAnotherTeam){
        try {
            let newTeamMember = await this.adminService.declineToAnotherTeam(Number(body.userId));
            return {message:"Пользователь был удален из очереди и не перенесен в другую команду"}
        } catch (error) {
            console.log(error);
            throw new HttpException(`${error}`,HttpStatus.BAD_REQUEST);
        }
        
    }

    

    // ПОЛУЧИТЬ ВСЕХ УЧАСНИКОВ КОТОРЫЕ ОТПРАВИЛИ ЗАЯВКИ
    @Roles(Access.Administrator,Access.Manager)
    @UseGuards(RoleGuard)
    @Get('/queue')
    async getqueue(@Query() query:Queue)
    {
        try {
            let queue = await this.adminService.allQueue(Number(query.userLimit), Number(query.offsetStart))
            return {queue,total: queue.length}
        } catch (error) {
            console.log(error);
            throw new HttpException(`${error}`,HttpStatus.BAD_REQUEST);
        }
    }

    @Roles(Access.Administrator,Access.Manager)
    @UseGuards(RoleGuard)
    @Delete('/deleteUserFromTeam')
    async deleteUserFromTeam(@Body() body:DeleteUserFromTeam){
        try {
            const message = await this.adminService.deleteUserFromTeam(Number(body.userId));
            return message
        } catch (error) {
            console.log(error);
            throw new HttpException(`${error}`,HttpStatus.BAD_REQUEST);
        }
    }

    @Roles(Access.Administrator,Access.Manager)
    @UseGuards(RoleGuard)
    @Patch('/memberToTeam')
    async memberToTeam(@Body() body:MemberToTeam){
        try {
            const message = await this.adminService.memberToTeam(Number(body.reqId), body.status);
            return message
        } catch (error) {
            console.log(error);
            throw new HttpException(`${error}`,HttpStatus.BAD_REQUEST);
        }
    }

    // @Roles(Access.Administrator,Access.Manager)
    // @UseGuards(RoleGuard)
    // @Patch('/memberToTeam')
    // async getMember(@Body() body:GetMember){
        // try {
            // let teams = await this.adminService.getMember(Number(body.userId));
            // return teams;
        // } catch (error) {
            // console.log(error)
            // throw new HttpException(`${error}`,HttpStatus.BAD_REQUEST);
        // }
    // }
}