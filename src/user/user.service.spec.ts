import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';

describe('UserService', () => {
  let userService: UserService;
  const mockUserRepository = {
    findByUsername: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: mockUserRepository },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('getByUsername', () => {
    it('should return a user if found', async () => {
      const mockUser = { username: 'test-user', password: 'password' };
      mockUserRepository.findByUsername.mockReturnValue(mockUser);

      const result = await userService.getByUsername('test-user');
      expect(mockUserRepository.findByUsername).toHaveBeenCalledWith(
        'test-user',
      );
      expect(result).toEqual(mockUser);
    });
  });
});
