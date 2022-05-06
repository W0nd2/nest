import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '../auth/auth.module';
import { FileModule } from '../file/file.module';
import { MailModule } from '../mail/mail.module';
import { TeamModule } from '../team/team.module';
import { Roles } from '../models/roles.model';
import { UsersController } from './users.controller';
import { Users } from '../models/users.model';
import { UsersService } from './users.service';
//test
import { TeamService } from '../team/team.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService,
    {
      provide: 'IUsersService',
      useClass: UsersService
    }
  ],
  imports:[
    TeamModule,
    AuthModule,
    SequelizeModule.forFeature([Users,Roles]),
    FileModule,
    MailModule,
  ]
})
export class UsersModule {}
