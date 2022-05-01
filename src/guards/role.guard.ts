import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { ROLES_KEY } from "./role.decorator";

@Injectable()
export class RoleGuard implements CanActivate{
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector
    ) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
                context.getHandler(),
                context.getClass(),
            ])
            console.log(requiredRoles);
            const req = context.switchToHttp().getRequest();
            const token = req.headers.authorization.split(' ')[1];
            if(!token){
                throw new UnauthorizedException({messahe:'Пользователь не прошел авторизацию'});
            }
            
            let user = this.jwtService.verify(token);
            req.users = user;
            return requiredRoles.includes(user.role);
        } catch (e) {
            console.log(e);
            throw new HttpException('У пользователся не достаточно прав', HttpStatus.FORBIDDEN);
        }
    }
}