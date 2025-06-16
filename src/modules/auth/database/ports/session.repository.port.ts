import { RepositoryPort } from '@src/libs/ddd';
import { SessionEntity } from '../../domain/session.entity';

export interface SessionRepositoryPort extends RepositoryPort<SessionEntity> {
  findOneByRefreshToken(refreshToken: string): Promise<SessionEntity>;

  deleteByRefreshToken(refreshToken: string): Promise<boolean>;
}
