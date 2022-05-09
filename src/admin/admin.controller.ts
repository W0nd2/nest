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
    UseGuards, 
    UsePipes
} from '@nestjs/common';
import { ValidationPipe } from '../pipes/validation.pipe';
import { BlockService } from '../block/block.service';
import { Roles } from '../guards/role.decorator';
import { RoleGuard } from '../guards/role.guard';
import { IAdminService } from './admin.interface';
import { AllManager } from './dto/all-managers.dto';
import { BlockUser } from './dto/block-user.dto';
import { ConfirmManager } from './dto/confrim-manager.dto';
import { DeclineManager } from './dto/decline-manager.dto';
import { DeclineToAnotherTeam } from './dto/decline-to-another-team.dto';
import { DeleteUserFromTeam } from './dto/delete-user-from-team.dto';
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
        @Inject('IAdminService') private adminService:IAdminService,
        //private adminService: AdminService,
        private blockService: BlockService
    ){}

    @UsePipes(ValidationPipe)
    @Roles(Access.Administrator)
    @UseGuards(RoleGuard)
    @Patch('/confirmManager')
    async confirmManager(@Body() body:ConfirmManager){
        try {
            let user = await this.adminService.confirmManager(body.id,body.reason);
            return user;
        } catch (error) {
            console.log(error);
            throw new HttpException(`${error}`,HttpStatus.BAD_REQUEST);
        }
    }

    @Roles(Access.Administrator)
    @UseGuards(RoleGuard)
    @Patch('/decline')
    async declineManager(@Body() body:DeclineManager){
        try {
            let user = await this.adminService.declineManager(body.id,body.reason);
            return user;
        } catch (error) {
            console.log(error);
            throw new HttpException(`${error}`,HttpStatus.BAD_REQUEST);
        }
    }

    @Roles(Access.Administrator)
    @UseGuards(RoleGuard)
    @Get('/managerByID')
    async getManagerById(@Query() query:ManagerById){
        try {
            let manager = await this.adminService.getManagerById(query.id);
            return manager;
        } catch (error) {
            console.log(error);
            throw new HttpException(`${error}`,HttpStatus.BAD_REQUEST);
        }
    }

    @Roles(Access.Administrator)
    @UseGuards(RoleGuard)
    @Get('/allManagers')
    async getManagers(@Query() query:AllManager){
        try {
            let managers = await this.adminService.getManagers(query.userLimit, query.offsetStart);
            return managers;
        } catch (error) {
            console.log(error);
            throw new HttpException(`${error}`,HttpStatus.BAD_REQUEST);
        }
    }

    @Roles(Access.Administrator,Access.Manager)
    @UseGuards(RoleGuard)
    @Patch('/blockUser')
    async blockUser(@Body() body:BlockUser){
        try {
            let block = await this.blockService.blockUser(body.id,body.reason,body.blockFlag);
            return block;
        } catch (error) {
            console.log(error);
            throw new HttpException(`${error}`,HttpStatus.BAD_REQUEST);
        }
    }

    @Roles(Access.Administrator,Access.Manager)
    @UseGuards(RoleGuard)
    @Patch('/unblockUser')
    async unblockUser(@Body() body:BlockUser){
        try {
            let block = await this.blockService.blockUser(body.id,body.reason,body.blockFlag);
            return block;
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
            let user = await this.adminService.getUserById(query.id);
            return user;
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
            let newTeamMember = await this.adminService.confirmMemberToAnTeam(body.userId, body.comandId);
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
            let newTeamMember = await this.adminService.declineToAnotherTeam(body.userId);
            return {message:"Пользователь был удален из очереди и не перенесен в другую команду"};
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
            let queue = await this.adminService.allQueue(query.userLimit, query.offsetStart);
            return {queue,total: queue.length};
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
            const message = await this.adminService.deleteUserFromTeam(body.userId);
            return message;
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
            const message = await this.adminService.memberToTeam(body.reqId, body.status);
            return message;
        } catch (error) {
            console.log(error);
            throw new HttpException(`${error}`,HttpStatus.BAD_REQUEST);
        }
    }
}