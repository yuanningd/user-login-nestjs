import { AuthGuard } from './auth.guard';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  const mockJwtService = { verify: jest.fn() };
  const mockReflector = { getAllAndOverride: jest.fn() };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        { provide: Reflector, useValue: mockReflector },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authGuard = module.get<AuthGuard>(AuthGuard);
  });
  describe('canActivate', () => {
    let mockExecutionContext;

    beforeEach(() => {
      mockExecutionContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn(),
        }),
      };
    });

    it('should return true if route is public', () => {
      mockReflector.getAllAndOverride.mockReturnValue(true);
      expect(authGuard.canActivate(mockExecutionContext as any)).toBe(true);
    });
    it('should throw UnauthorizedException if token is missing', () => {
      mockReflector.getAllAndOverride.mockReturnValue(false);
      mockExecutionContext
        .switchToHttp()
        .getRequest.mockReturnValue({ headers: {} });
      expect(() => authGuard.canActivate(mockExecutionContext)).toThrowError(
        'Unauthorized',
      );
    });
    it('should return true if token is valid', () => {
      mockReflector.getAllAndOverride.mockReturnValue(false);
      mockExecutionContext.switchToHttp().getRequest.mockReturnValue({
        headers: { authorization: 'Bearer valid_token' },
      });

      mockJwtService.verify.mockReturnValue(true);
      expect(authGuard.canActivate(mockExecutionContext)).toBe(true);
    });

    it('should throw exception if token is not valid', () => {
      mockReflector.getAllAndOverride.mockReturnValue(false);
      mockExecutionContext.switchToHttp().getRequest.mockReturnValue({
        headers: { authorization: 'Bearer invalid_token' },
      });

      mockJwtService.verify.mockImplementation(() => {
        throw new Error();
      });
      expect(() => authGuard.canActivate(mockExecutionContext)).toThrowError(
        'Unauthorized',
      );
    });
  });
});
