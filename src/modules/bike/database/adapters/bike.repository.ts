import { BikeRepositoryPort } from '../ports/bike.repository.port';
import { BikeEntity } from '../../domain/bike.entity';
import { SqlRepositoryBase } from '@src/libs/db/sql-repository.base';
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BikeOrmEntity } from '../bike.orm-entity';
import { BikeMapper } from '../../bike.mapper';

@Injectable()
export class BikeRepository
  extends SqlRepositoryBase<BikeEntity, BikeOrmEntity>
  implements BikeRepositoryPort
{
  protected readonly entityClass = BikeOrmEntity;

  constructor(mapper: BikeMapper, eventEmitter: EventEmitter2) {
    super(mapper, eventEmitter, new Logger(BikeRepository.name));
  }

  async findOneByEnginePower(power: number): Promise<BikeEntity> {
    const entity = await this.repository.findOne({
      where: { enginePower: power },
    });

    if (!entity) {
      throw new Error(`Bike with engine power ${power} not found`);
    }

    return this.mapper.toDomain(entity);
  }
}
