import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { UserOrmEntity } from '../../user/database/user.orm-entity'; // Adjust path if necessary
import { VerificationStatus } from '../domain/auth.types';

@Entity({ name: 'user_verifications' })
export class UserVerificationOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @OneToOne(() => UserOrmEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserOrmEntity;

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
