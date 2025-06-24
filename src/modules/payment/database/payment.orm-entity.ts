import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PaymentMethod, PaymentStatusType } from '../domain/payment.types';

@Entity('payments')
export class PaymentOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  bookingId: string;

  @Column()
  orderId: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: PaymentMethod })
  method: PaymentMethod;

  @Column({ type: 'enum', enum: PaymentStatusType })
  status: PaymentStatusType;

  @Column({ type: 'text', nullable: true })
  failureReason?: string;

  @Column({ type: 'varchar', nullable: true })
  authorizationId?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
