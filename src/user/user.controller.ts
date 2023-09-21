import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserPostDto } from './dto/user.post-dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async createUser(@Body() userPostDto: UserPostDto) {
    return await this.userService.create(userPostDto);
  }
}
