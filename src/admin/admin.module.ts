import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { BlockModule } from '../block/block.module';
import { BlockService } from '../block/block.service';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService,
    {
      provide: 'IAdminService',
      useClass: AdminService
    }
  ],
  imports:[
    AuthModule,
    BlockModule
  ]
})
export class AdminModule {}
