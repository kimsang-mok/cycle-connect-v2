import { UserRepositoryPort } from '@src/modules/user/database/ports/user.repository.port';
import { LoginUserService } from './login-user.service';
import { AuthenticateUserService } from '../../services/authenticate-user.service';
import { LoginUserCommand } from './login-user.command';
import { UserNotFoundError } from '@src/modules/user/user.errors';
import { UserEntity } from '@src/modules/user/domain/user.entity';
import { InvalidCredentialError } from '../../auth.errors';
import {
  mockClassMethods,
  mockInterface,
  mockAggregateRoot,
  mockValueObject,
} from '@tests/utils/create-mock';
import { Password } from '@src/modules/user/domain/value-objects/password.value-object';

describe('LoginUserService', () => {
  let service: LoginUserService;
  let userRepo: jest.Mocked<UserRepositoryPort>;
  let authenticateUserService: jest.Mocked<AuthenticateUserService>;

  beforeEach(() => {
    userRepo = mockInterface<UserRepositoryPort>();

    authenticateUserService = mockClassMethods(AuthenticateUserService);

    service = new LoginUserService(userRepo, authenticateUserService);
  });

  const command = new LoginUserCommand({
    email: 'test@example.com',
    password: 'password123',
    cookies: {} as any,
  });

  it('should throw UserNotFoundError if user not found', async () => {
    userRepo.findOneByEmail.mockResolvedValue(null);

    await expect(service.execute(command)).rejects.toThrow(UserNotFoundError);
  });

  it('should throw InvalidCredentialError if password does not match', async () => {
    const mockUser = mockAggregateRoot(UserEntity, {
      password: mockValueObject(Password, {
        overrides: { compare: jest.fn().mockResolvedValue(false) },
        value: 'hashed-password',
      }),
    });

    userRepo.findOneByEmail.mockResolvedValue(mockUser);

    await expect(service.execute(command)).rejects.toThrow(
      InvalidCredentialError,
    );
  });

  it('should return auth result if credentials are valid', async () => {
    const mockUser = {
      getProps: () => ({
        password: {
          compare: jest.fn().mockResolvedValue(true),
        },
      }),
    } as unknown as UserEntity;

    const mockAuthResult = {
      accessToken: 'mock-token',
      refreshToken: 'mock-refresh',
    };

    userRepo.findOneByEmail.mockResolvedValue(mockUser);
    authenticateUserService.execute.mockResolvedValue(mockAuthResult);

    const result = await service.execute(command);

    expect(result).toEqual({ user: mockUser, ...mockAuthResult });
    expect(authenticateUserService.execute).toHaveBeenCalledWith({
      cookies: command.cookies,
      user: mockUser,
    });
  });
});
