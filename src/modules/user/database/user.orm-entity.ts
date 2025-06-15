import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { UserRoles } from '../domain/user.types';
import { UserVerificationOrmEntity } from '@src/modules/auth/database/user-verification.orm-entity';

@Entity({ name: 'users' })
export class UserOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRoles })
  role: UserRoles;

  @OneToOne(
    () => UserVerificationOrmEntity,
    (verification) => verification.user,
  )
  verification: UserVerificationOrmEntity;
}
