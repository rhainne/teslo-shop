import { Controller, Post, Body, Get, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { Auth, GetUser, RoleProtected } from './decorators/';
import { User } from './entities/user.entity';
import { GetRawHeaders } from 'src/common/decorators/request-raw-headers.decorator';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { ValidRole } from './enums/valid-roles.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get('testPrivateRoute')
  @UseGuards(AuthGuard('jwt'))
  testingPrivateRoute(
    @GetUser() user: User,
    @GetUser(['email', 'fullName', 'id']) email: string,
    @GetRawHeaders() rawHeaders: string[]
  ) {
    return {
      ok: true,
      message: 'This is a private route',
      user,
      userEmail: email,
      rawHeaders
    };
  }

  // @SetMetadata('roles', ['admin', 'super-user']) // Custom metadata for roles
  @Get('testPrivateRoute2')
  @RoleProtected(ValidRole.admin) // Custom decorator for roles
  @UseGuards(AuthGuard('jwt'), UserRoleGuard)
  testingPrivateRoute2(
    @GetUser() user: User,
  ) {
    return {
      ok: true,
      message: 'This is the second private route',
      user,
    };
  }

  @Get('testPrivateRoute3')
  @Auth(ValidRole.superUser)
  testingPrivateRoute3(
    @GetUser() user: User,
  ) {
    return {
      ok: true,
      message: 'This is the third private route',
      user,
    };
  }

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }
}
