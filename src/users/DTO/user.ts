import { IsEmail, IsString, MinLength } from 'class-validator';

export class UserDto {
  @MinLength(4)
  @IsString()
  name: string;
  @IsEmail()
  email: string;
  @MinLength(8)
  @IsString()
  password: string;
}
