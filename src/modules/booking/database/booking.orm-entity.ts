import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BookingStatus } from '../domain/booking.types';

@Entity({ name: 'bookings' })
export class BookingOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column({ type: 'uuid' })
  bikeId: string;

  @Column()
  customerName: string;

  @Column({ type: 'date' }) // '2025-06-19'
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ type: 'enum', enum: BookingStatus })
  status: BookingStatus;

  @Column({ type: 'numeric' }) // for money-safe decimal value
  totalPrice: number;
}
