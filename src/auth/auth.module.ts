import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { GoogleStrategy } from './google.strategy';

@Module({
  providers: [
    AuthService,
    GoogleStrategy,
    {
      provide: 'IAuthService',
      useClass: AuthService
    }
  ],
  controllers: [AuthController],
  exports:[JwtModule],
  imports:[
    JwtModule.register({
      secret: process.env.PRIVETE_KEY || 'SECRET',
      signOptions:{
        expiresIn: '24h'
      }
    })
  ],
})
export class AuthModule {}
