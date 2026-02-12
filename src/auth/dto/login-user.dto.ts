import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
} from "class-validator";

export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsDefined()
  @IsNotEmpty()
  password: string;
}
