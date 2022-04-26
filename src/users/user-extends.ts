import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: object, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.users
    return user;
  },
);