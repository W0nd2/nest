import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { FileModule } from 'src/file/file.module';
import { MailModule } from 'src/mail/mail.module';
import { Roles } from '../models/roles.model';
import { UsersController } from './users.controller';
import { Users } from './users.model';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports:[
    AuthModule,
    SequelizeModule.forFeature([Users,Roles]),
    FileModule,
    MailModule
  ]
})
export class UsersModule {}
