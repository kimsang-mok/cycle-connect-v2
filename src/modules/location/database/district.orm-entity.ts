import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('districts')
export class DistrictOrmEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'int' })
  code: number;

  @Column({ type: 'varchar', length: 255 })
  nameKm: string;

  @Column({ type: 'varchar', length: 255 })
  nameEn: string;

  @Column()
  provinceCode: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
