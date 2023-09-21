import { IsNotEmpty, IsString } from 'class-validator';

export class UserPostDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
