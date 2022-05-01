import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private jwtService: JwtService) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        try {
            const token = req.headers.authorization.split(' ')[1];
            if(!token){
                throw new UnauthorizedException({messahe:'Пользователь не прошел авторизацию'});
            }
            
            let user = this.jwtService.verify(token);
            req.users = user;
            return true;
        } catch (e) {
            console.log(e);
            throw new UnauthorizedException({messahe:'Пользователь не прошел авторизацию'});
        }
    }
}