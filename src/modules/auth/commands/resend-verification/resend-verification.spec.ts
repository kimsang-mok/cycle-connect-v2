import { UserRepositoryPort } from '@src/modules/user/database/ports/user.repository.port';
import { ResendVerificationService } from './resend-verification.service';
import { UserVerificationRepositoryPort } from '../../database/ports/user-verification.repository.port';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  mockAggregateRoot,
  mockClassMethods,
  mockInterface,
  mockValueObject,
} from '@tests/utils';
import { ResendVerificationCommand } from './resend-verification.command';
import { UserNotFoundError } from '@src/modules/user/user.errors';
import { UserVerificationEntity } from '../../domain/user-verification.entity';
import { VerificationStatus } from '../../domain/auth.types';
import { UserAlreadyVerifiedError } from '../../auth.errors';
import { UserEntity } from '@src/modules/user/domain/user.entity';
import { Email } from '@src/modules/user/domain/value-objects/email.value-object';

describe('ResendVerificationService', () => {
  let service: ResendVerificationService;
  let userRepo: jest.Mocked<UserRepositoryPort>;
  let userVerificationRepo: jest.Mocked<UserVerificationRepositoryPort>;
  let configService: jest.Mocked<ConfigService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockEmail = 'test@example.com';

  const command = new ResendVerificationCommand({ email: mockEmail });

  const mockUser = mockAggregateRoot(UserEntity, {
    email: mockValueObject(Email, {
      overrides: {
        unpack: (() => mockEmail) as any,
      },
    }),
  });

  beforeEach(() => {
    userRepo = mockInterface<UserRepositoryPort>();
    userVerificationRepo = mockInterface<UserVerificationRepositoryPort>();
    configService = mockClassMethods(ConfigService);
    jwtService = mockClassMethods(JwtService);

    service = new ResendVerificationService(
      userRepo,
      userVerificationRepo,
      configService,
      jwtService,
    );

    userRepo.findOneByEmail.mockResolvedValue(mockUser);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should throw UserNotFoundError if user does not exist', async () => {
    userRepo.findOneByEmail.mockResolvedValue(null);

    expect(service.execute(command)).rejects.toThrow(UserNotFoundError);
  });

  it('should throw UserAlreadyVerifiedError if account is already verified', async () => {
    const mockVerification = mockAggregateRoot(UserVerificationEntity, {
      status: VerificationStatus.verified,
    });

    userVerificationRepo.findOneByUserId.mockResolvedValue(mockVerification);

    expect(service.execute(command)).rejects.toThrow(UserAlreadyVerifiedError);
  });

  it('should successfully update the token', async () => {
    const mockVerification = mockAggregateRoot(UserVerificationEntity, {
      status: VerificationStatus.pending,
    });

    userVerificationRepo.findOneByUserId.mockResolvedValue(mockVerification);

    const mockToken = 'token';

    jwtService.signAsync.mockResolvedValue(mockToken);

    await service.execute(command);

    expect(mockVerification.updateToken).toHaveBeenCalledWith(
      mockToken,
      mockEmail,
    );
    expect(userVerificationRepo.update).toHaveBeenCalledWith(mockVerification);
  });
});
