import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BikeTypes } from '../domain/bike.types';

@Entity({ name: 'bike' })
export class BikeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column({ type: 'uuid' })
  ownerId: string;

  @Column({ type: 'enum', enum: BikeTypes })
  type: BikeTypes;

  @Column()
  model: string;

  @Column()
  enginePower: number;

  @Column({ type: 'numeric' })
  pricePerDay: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ type: 'text', array: true, default: [] })
  photoKeys: string[];

  @Column({ type: 'text', default: '' })
  thumbnailKey: string;
}
