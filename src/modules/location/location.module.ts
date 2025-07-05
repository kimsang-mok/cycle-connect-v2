import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ListAllProvincesController } from './queries/list-all-provinces/list-all-provinces.controller';
import { ListAllProvincesQueryHandler } from './queries/list-all-provinces/list-all-provinces.query-handler';
import { DISTRICT_REPOSITORY, PROVINCE_REPOSITORY } from './location.di-tokens';
import { ProvinceRepository } from './database/adapters/province.repository';
import { ProvinceMapper } from './province.mapper';
import { DistrictMapper } from './district.mapper';
import { DistrictRepository } from './database/adapters/district.repository';
import { ListDistrictsByProvinceCodeController } from './queries/list-districts-by-province-id/list-districts-by-province-code.controller';
import { ListDistrictsByProvinceCodeQueryHandler } from './queries/list-districts-by-province-id/list-districts-by-province-code.query-handler';
import { LocationQueryService } from './queries/shared/location-query.service';

const controllers = [
  ListAllProvincesController,
  ListDistrictsByProvinceCodeController,
];

const queryHandlers: Provider[] = [
  ListAllProvincesQueryHandler,
  ListDistrictsByProvinceCodeQueryHandler,
];

const services: Provider[] = [LocationQueryService];

const repositories: Provider[] = [
  {
    provide: PROVINCE_REPOSITORY,
    useClass: ProvinceRepository,
  },
  {
    provide: DISTRICT_REPOSITORY,
    useClass: DistrictRepository,
  },
];

const mappers: Provider[] = [ProvinceMapper, DistrictMapper];

@Module({
  imports: [CqrsModule],
  controllers: [...controllers],
  providers: [
    Logger,
    ...queryHandlers,
    ...repositories,
    ...mappers,
    ...services,
  ],
  exports: [LocationQueryService, ...mappers],
})
export class LocationModule {}
