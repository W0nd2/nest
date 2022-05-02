import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { BlockModule } from 'src/block/block.module';
import { TeamService } from './team.service';

@Module({
  controllers: [],
  providers: [TeamService],
  imports:[
    AuthModule,
    BlockModule
  ],
  exports:[TeamService]
})
export class TeamModule {}
