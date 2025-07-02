import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('provinces')
export class ProvinceOrmEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'int' })
  code: number;

  @Column({ type: 'varchar', length: 255 })
  nameKm: string;

  @Column({ type: 'varchar', length: 255 })
  nameEn: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
