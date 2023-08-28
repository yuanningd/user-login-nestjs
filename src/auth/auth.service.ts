import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, password: string) {
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
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    if (user.lastAttempt && user.lastAttempt > fiveMinutesAgo) {
      user.attempts += 1;
    } else {
      user.attempts = 1;
    }

    user.lastAttempt = now;

    if (user.attempts >= 3) {
      user.isLocked = true;
    }

    await user.save();
  }
  private async resetFailedLoginAttempts(user: User) {
    user.attempts = 0;
    user.lastAttempt = null;
    user.isLocked = false;
    await user.save();
  }
}
