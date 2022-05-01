import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { BlockModule } from 'src/block/block.module';
import { BlockService } from 'src/block/block.service';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  imports:[
    AuthModule,
    BlockModule
  ]
})
export class AdminModule {}
