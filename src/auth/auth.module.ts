import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  exports:[JwtModule],
  imports:[
    JwtModule.register({
      secret: process.env.PRIVETE_KEY || 'SECRET',
      signOptions:{
        expiresIn: '24h'
      }
    })
  ]
})
export class AuthModule {}
