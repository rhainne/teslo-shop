import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { UserRoleGuard } from "../guards/user-role/user-role.guard";
import { ValidRole } from "../enums/valid-roles.enum";
import { RoleProtected } from "./";

export function Auth(...roles: ValidRole[]) {
  return applyDecorators(
    RoleProtected(...roles), // Custom decorator for roles
    UseGuards(AuthGuard('jwt'), UserRoleGuard),
  );
}
