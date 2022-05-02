import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { Users } from "./users/users.model";
import { UsersModule } from './users/users.module';
import { Roles } from "./models/roles.model";
import { AuthModule } from './auth/auth.module';
import { Banlist } from "./models/banlist.model";
import { AproveList } from "./models/aprove-list.model";
import { TeamModule } from './team/team.module';
import { Comand } from "./models/comand.model";
import { RequestComand } from "./models/request-comand.model";
import { UserComand } from "./models/user-comand.model";
import { AdminModule } from './admin/admin.module';
import { BlockModule } from './block/block.module';
import { FileModule } from './file/file.module';
import { ServeStaticModule } from "@nestjs/serve-static";
import { MailModule } from './mail/mail.module';
import * as path from "path";
import { Token } from "./models/token.model";
import { SocketGateway } from "./socket/socket.gateway";

@Module({
    imports: [
        ServeStaticModule.forRoot({
          rootPath: path.resolve(__dirname,'static'),
        }),
        ConfigModule.forRoot({
            envFilePath: '.env'
        }),
        SequelizeModule.forRoot({
          dialect: 'postgres',
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          username: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          models: [
            AproveList,
            Banlist,
            Comand,
            RequestComand,
            Roles,
            UserComand,
            Token,
            Users,
          ],
          autoLoadModels:true,
          logging:false
        }),
        UsersModule,
        AuthModule,
        TeamModule,
        AdminModule,
        BlockModule,
        FileModule,
        MailModule
      ],
      providers:[SocketGateway]
})
export class AppModule{}