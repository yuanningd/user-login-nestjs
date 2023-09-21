import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserPostDto } from './dto/user.post-dto';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getByUsername(username: string) {
    return await this.userRepository.findByUsername(username);
  }

  async create(userPostDto: UserPostDto) {
    return await this.userRepository.create(userPostDto);
  }
}
