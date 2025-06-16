import { RepositoryPort } from '@src/libs/ddd';
import { UserVerificationEntity } from '../../domain/user-verification.entity';

export interface UserVerificationRepositoryPort
  extends RepositoryPort<UserVerificationEntity> {
  findOneByUserId(userId: string): Promise<UserVerificationEntity>;
}
