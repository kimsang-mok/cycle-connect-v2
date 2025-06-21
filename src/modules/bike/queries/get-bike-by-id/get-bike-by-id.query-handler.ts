import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetBikeByIdQuery } from './get-bike-by-id.query';
import { Inject } from '@nestjs/common';
import { BIKE_REPOSITORY } from '../../bike.di-tokens';
import { BikeRepositoryPort } from '../../database/ports/bike.repository.port';
import { BikeNotFoundError } from '../../bike.errors';
import { BikeEntity } from '../../domain/bike.entity';

@QueryHandler(GetBikeByIdQuery)
export class GetBikeByIdQueryHandler
  implements IQueryHandler<GetBikeByIdQuery, BikeEntity>
{
  constructor(
    @Inject(BIKE_REPOSITORY) private readonly bikeRepo: BikeRepositoryPort,
  ) {}

  async execute(query: GetBikeByIdQuery): Promise<BikeEntity> {
    const bike = await this.bikeRepo.findOneById(query.id);

    if (!bike) {
      throw new BikeNotFoundError();
    }

    return bike;
  }
}
