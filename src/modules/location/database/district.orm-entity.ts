import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProvinceOrmEntity } from './province.orm-entity';

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

  @ManyToOne(() => ProvinceOrmEntity, { eager: false, nullable: false })
  @JoinColumn({ name: 'province_code', referencedColumnName: 'code' })
  province: ProvinceOrmEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
