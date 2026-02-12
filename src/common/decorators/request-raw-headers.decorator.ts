import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException
} from "@nestjs/common";

export const GetRawHeaders = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const rawHeaders = ctx.switchToHttp().getRequest().rawHeaders;

  if (!rawHeaders)
    throw new InternalServerErrorException('Raw headers not found in request context');

  return rawHeaders;
});