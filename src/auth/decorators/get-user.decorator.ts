import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException
} from "@nestjs/common";

export const GetUser = createParamDecorator((data: Array<string>, ctx: ExecutionContext) => {
  const user = ctx.switchToHttp().getRequest().user;

  if (!user)
    throw new InternalServerErrorException('User not found in request context');

  if (data && Array.isArray(data)) {
    return Object.fromEntries(
      data.map(key => [key, user[key]])
    );
  }

  return user;
});