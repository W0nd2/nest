import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { BlockModule } from 'src/block/block.module';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';

@Module({
  controllers: [TeamController],
  providers: [TeamService],
  imports:[
    AuthModule,
    BlockModule
  ]
})
export class TeamModule {}
