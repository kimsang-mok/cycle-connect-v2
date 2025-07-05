import { Logger, Module, Provider } from '@nestjs/common';
import { BikeMapper } from './bike.mapper';
import { CreateBikeController } from './commands/create-bike/create-bike.controller';
import { BIKE_REPOSITORY } from './bike.di-tokens';
import { BikeRepository } from './database/adapters/bike.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateBikeService } from './commands/create-bike/create-bike.service';
import { ActivateBikeService } from './commands/activate-bike/activate-bike.service';
import { ActivateBikeController } from './commands/activate-bike/activate-bike.controller';
import { ListMyBikesController } from './queries/list-my-bikes/list-my-bikes.controller';
import { ListMyBikesQueryHandler } from './queries/list-my-bikes/list-my-bikes.query-handler';
import { GetBikeByIdController } from './queries/get-bike-by-id/get-bike-by-id.controller';
import { GetBikeByIdQueryHandler } from './queries/get-bike-by-id/get-bike-by-id.query-handler';
import { ListCustomerBikesController } from './queries/list-customer-bike/list-customer-bikes.controller';
import { ListCustomerBikesQueryHandler } from './queries/list-customer-bike/list-customer-bikes.query-handler';
import { UploaderModule } from '@src/libs/uploader/uploader.module';
import { LocationModule } from '../location/location.module';

const controllers = [
  CreateBikeController,
  ActivateBikeController,
  ListCustomerBikesController,
  ListMyBikesController,
  GetBikeByIdController,
];

const commandHandlers: Provider[] = [CreateBikeService, ActivateBikeService];

const queryHandlers: Provider[] = [
  ListMyBikesQueryHandler,
  GetBikeByIdQueryHandler,
  ListCustomerBikesQueryHandler,
];

const repositories: Provider[] = [
  {
    provide: BIKE_REPOSITORY,
    useClass: BikeRepository,
  },
];

const mappers: Provider[] = [BikeMapper];

@Module({
  imports: [CqrsModule, UploaderModule.register(), LocationModule],
  controllers: [...controllers],
  providers: [
    Logger,
    ...repositories,
    ...commandHandlers,
    ...queryHandlers,
    ...mappers,
  ],
  exports: [BIKE_REPOSITORY],
})
export class BikeModule {}
