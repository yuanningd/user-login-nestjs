import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.schema';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn({ username, password }: LoginDto) {
    const user = await this.userService.getByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password.');
    }

    if (user.isLocked) {
      throw new ForbiddenException('User is locked.');
    }

    if (user.password != password) {
      await this.handleFailedLoginAttempt(user);
      throw new UnauthorizedException('Invalid username or password.');
    }

    await this.resetFailedLoginAttempts(user);

    const payload = { username: user.username, sub: user._id };
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
    };
  }

  private async handleFailedLoginAttempt(user: User) {
    const now = new Date();

    // If firstAttempt is not set or if it's older than 5 minutes,
    // reset it and the attempts counter
    if (
      !user.firstAttempt ||
      now.getTime() - user.firstAttempt.getTime() > 5 * 60 * 1000
    ) {
      user.firstAttempt = now;
      user.attempts = 1;
    } else {
      // Otherwise, increment the attempts counter
      user.attempts += 1;
    }

    if (user.attempts >= 3) {
      user.isLocked = true;
    }

    await user.save();
  }
  private async resetFailedLoginAttempts(user: User) {
    user.attempts = 0;
    user.firstAttempt = null;
    await user.save();
  }
}
