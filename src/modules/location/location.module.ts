import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ListAllProvincesController } from './queries/list-all-provinces/list-all-provinces.controller';
import { ListAllProvincesQueryHandler } from './queries/list-all-provinces/list-all-provinces.query-handler';
import { PROVINCE_REPOSITORY } from './location.di-tokens';
import { ProvinceRepository } from './database/adapters/province.repository';
import { ProvinceMapper } from './province.mapper';

const controllers = [ListAllProvincesController];

const queryHandlers: Provider[] = [ListAllProvincesQueryHandler];

const repositories: Provider[] = [
  {
    provide: PROVINCE_REPOSITORY,
    useClass: ProvinceRepository,
  },
];

const mappers: Provider[] = [ProvinceMapper];

@Module({
  imports: [CqrsModule],
  controllers: [...controllers],
  providers: [Logger, ...queryHandlers, ...repositories, ...mappers],
})
export class LocationModule {}
