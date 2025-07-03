import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateBikeCommand } from './create-bike.command';
import { AggregateId } from '@src/libs/ddd';
import { Inject } from '@nestjs/common';
import { BIKE_REPOSITORY } from '../../bike.di-tokens';
import { BikeRepositoryPort } from '../../database/ports/bike.repository.port';
import { BikeEntity } from '../../domain/bike.entity';
import { Transactional } from '@src/libs/application/decorators';
import { Price } from '../../domain/value-objects/price.value-object';

@CommandHandler(CreateBikeCommand)
export class CreateBikeService
  implements ICommandHandler<CreateBikeCommand, AggregateId>
{
  constructor(
    @Inject(BIKE_REPOSITORY)
    protected readonly bikeRepo: BikeRepositoryPort,
  ) {}
  @Transactional()
  async execute(command: CreateBikeCommand): Promise<string> {
    const bike = BikeEntity.create({
      type: command.type,
      model: command.model,
      ownerId: command.ownerId,
      enginePower: command.enginePower,
      description: command.description,
      pricePerDay: new Price(command.pricePerDay),
      photoKeys: command.photoKeys,
      thumbnailKey: command.thumbnailKey,
      districtCode: command.districtCode,
    });

    try {
      /* Wrapping operation in a transaction to make sure
         that all domain events are processed atomically */
      await this.bikeRepo.insert(bike);
      return bike.id;
    } catch (error: any) {
      // Handle specific errors if needed
      console.log(error);
      throw error;
    }
  }
}
