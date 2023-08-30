import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.schema';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  const mockUserService = {
    getByUsername: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      mockUserService.getByUsername.mockReturnValue(null);

      await expect(service.signIn('username', 'password')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw ForbiddenException if user is locked', async () => {
      mockUserService.getByUsername.mockReturnValue({
        isLocked: true,
      });

      await expect(service.signIn('username', 'password')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      mockUserService.getByUsername.mockReturnValue({
        isLocked: false,
        password: 'correct_password',
        save: jest.fn(),
      } as unknown as User);

      await expect(
        service.signIn('username', 'wrong_password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return an access token if credentials are correct', async () => {
      mockUserService.getByUsername.mockReturnValue({
        isLocked: false,
        password: 'correct_password',
        username: 'username',
        _id: 'some_id',
        save: jest.fn(),
      } as unknown as User);

      mockJwtService.sign.mockReturnValue('access_token');

      const result = await service.signIn('username', 'correct_password');

      expect(result).toEqual({ accessToken: 'access_token' });
    });

    it('should increase the attempts count and set firstAttempt', async () => {
      const mockUser = {
        isLocked: false,
        password: 'correct_password',
        username: 'username',
        _id: 'some_id',
        attempts: 0,
        firstAttempt: null,
        save: jest.fn(),
      } as unknown as User;

      mockUserService.getByUsername.mockReturnValue(mockUser);

      await expect(
        service.signIn('username', 'wrong_password'),
      ).rejects.toThrow(UnauthorizedException);

      expect(mockUser.attempts).toBe(1);
      expect(mockUser.firstAttempt).not.toBeNull();
      expect(mockUser.save).toHaveBeenCalled();
    });

    it('should lock the user after 3 failed attempts within 5 minutes', async () => {
      const mockUser = {
        isLocked: false,
        password: 'correct_password',
        username: 'username',
        _id: 'some_id',
        attempts: 2,
        firstAttempt: new Date(),
        save: jest.fn(),
      } as unknown as User;

      mockUserService.getByUsername.mockReturnValue(mockUser);

      await expect(
        service.signIn('username', 'wrong_password'),
      ).rejects.toThrow(UnauthorizedException);

      expect(mockUser.attempts).toBe(3);
      expect(mockUser.isLocked).toBe(true);
      expect(mockUser.save).toHaveBeenCalled();
    });
  });
});
