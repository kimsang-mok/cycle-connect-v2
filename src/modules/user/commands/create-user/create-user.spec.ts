import {
  mockAggregateRoot,
  mockInterface,
  mockValueObject,
} from '@tests/utils';
import { UserRepositoryPort } from '../../database/ports/user.repository.port';
import { CreateUserService } from './create-user.service';
import { CreateUserCommand } from './create-user.command';
import { UserRoles } from '../../domain/user.types';
import { UserEntity } from '../../domain/user.entity';
import { Password } from '../../domain/value-objects/password.value-object';
import { UserAlreadyExistsError } from '../../user.errors';
import { ConflictException } from '@src/libs/exceptions';

describe('CreateUserService', () => {
  let service: CreateUserService;
  let userRepo: jest.Mocked<UserRepositoryPort>;

  const userCommandProps = {
    email: 'test@mail.com',
    firstName: 'Test',
    lastName: 'User',
    password: 'Password123',
    role: UserRoles.renter,
  };

  beforeEach(() => {
    userRepo = mockInterface<UserRepositoryPort>();

    service = new CreateUserService(userRepo);
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create and insert a user, then return its id', async () => {
    const mockId = 'mock-user-id';
    const command = new CreateUserCommand(userCommandProps);

    const mockUser = mockAggregateRoot(UserEntity, {
      id: mockId,
      password: mockValueObject(Password, {
        overrides: { compare: jest.fn().mockResolvedValue(false) },
        value: 'hashed-password',
      }),
    });

    jest.spyOn(UserEntity, 'create').mockReturnValue(mockUser);

    const result = await service.execute(command);

    expect(typeof result).toBe('string');

    expect(userRepo.insert).toHaveBeenCalledWith(mockUser);

    expect(result).toEqual(mockId);
  });

  it('should throw an error if user already exists', async () => {
    const command = new CreateUserCommand(userCommandProps);

    // Mock insert to simulate conflict (duplicate user)
    userRepo.insert.mockImplementation(() => {
      throw new ConflictException('User already exists');
    });

    await expect(service.execute(command)).rejects.toThrow(
      UserAlreadyExistsError,
    );
  });
});
