import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail, IsString, Matches, MaxLength, MinLength
} from "class-validator";

export class CreateUserDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
    nullable: false,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'P@ssw0rd',
    minLength: 8,
    maxLength: 50,
    nullable: false,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  @Matches(
    /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'The password must have at least an uppercase, a lowercase letter and a number'
  })
  password: string;

  @ApiProperty({
    description: 'The full name of the user',
    example: 'John Doe',
  })
  @IsString()
  @MinLength(1)
  fullName: string;
}
