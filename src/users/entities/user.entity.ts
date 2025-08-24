import { Transform } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

export class User {
  @IsString()
  id: string;

  @IsEmail()
  email: string;

  @Transform(({ value }) => value.trim())
  username: string;

  @Transform(({ value }) => value.trim())
  password: string;
}
