import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from 'src/auth/entities/user.entity';
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler());

    if (!validRoles)
      return true;

    const user = context.switchToHttp().getRequest().user as User;
    if (!user)
      throw new InternalServerErrorException('User not found in request context');

    console.log({ validRoles, userRoles: user.roles });

    if (
      validRoles.length === 0 ||
      user.roles.some(role => validRoles.includes(role))
    )
      return true;
    else
      throw new ForbiddenException(
        'User does not have the required roles to access this resource'
      );
  }
}
