import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ActivateBikeCommand } from './activate-bike.command';
import { AggregateId } from '@src/libs/ddd';
import { Inject } from '@nestjs/common';
import { BIKE_REPOSITORY } from '../../bike.di-tokens';
import { BikeRepositoryPort } from '../../database/ports/bike.repository.port';
import { BikeNotFoundError, BikeOwnershipError } from '../../bike.errors';

@CommandHandler(ActivateBikeCommand)
export class ActivateBikeService
  implements ICommandHandler<ActivateBikeCommand, AggregateId>
{
  constructor(
    @Inject(BIKE_REPOSITORY)
    protected bikeRepo: BikeRepositoryPort,
  ) {}

  async execute(command: ActivateBikeCommand): Promise<AggregateId> {
    const bike = await this.bikeRepo.findOneById(command.bikeId);

    if (!bike) {
      throw new BikeNotFoundError();
    }

    if (bike.getProps().ownerId !== command.requesterId) {
      throw new BikeOwnershipError();
    }

    bike.activate();
    await this.bikeRepo.update(bike);

    return bike.id;
  }
}
