import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';
import { VerificationStatus } from '../domain/auth.types';

@Entity({ name: 'user_verifications' })
export class UserVerificationOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.pending,
  })
  status: VerificationStatus;

  @Column({ type: 'timestamp' })
  verifiedAt?: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
