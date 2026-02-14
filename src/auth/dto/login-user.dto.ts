import { ApiProperty } from "@nestjs/swagger";
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
} from "class-validator";

export class LoginUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'StronPassword123',
    description: 'The password of the user',
  })
  @IsDefined()
  @IsNotEmpty()
  password: string;
}
