import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetBikeByIdQuery } from './get-bike-by-id.query';
import { Inject } from '@nestjs/common';
import { BIKE_REPOSITORY } from '../../bike.di-tokens';
import { BikeRepositoryPort } from '../../database/ports/bike.repository.port';
import { BikeNotFoundError } from '../../bike.errors';
import { BikeEntity } from '../../domain/bike.entity';
import { LocationQueryService } from '@src/modules/location/queries/shared/location-query.service';
import { ProvinceOrmEntity } from '@src/modules/location/database/province.orm-entity';
import { DistrictOrmEntity } from '@src/modules/location/database/district.orm-entity';

export interface GetBikeByIdQueryResult {
  bike: BikeEntity;
  location: {
    province: ProvinceOrmEntity;
    district: DistrictOrmEntity;
  };
}

@QueryHandler(GetBikeByIdQuery)
export class GetBikeByIdQueryHandler
  implements IQueryHandler<GetBikeByIdQuery, GetBikeByIdQueryResult>
{
  constructor(
    @Inject(BIKE_REPOSITORY) private readonly bikeRepo: BikeRepositoryPort,
    private readonly locationQueryService: LocationQueryService,
  ) {}

  async execute(query: GetBikeByIdQuery): Promise<GetBikeByIdQueryResult> {
    const bike = await this.bikeRepo.findOneById(query.id);

    if (!bike) {
      throw new BikeNotFoundError();
    }

    const location =
      await this.locationQueryService.getDistrictWithProvinceByDistrictCode(
        bike.getProps().districtCode,
      );

    return { bike, location };
  }
}
