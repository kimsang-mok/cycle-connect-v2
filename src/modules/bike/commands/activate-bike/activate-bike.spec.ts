import { mockAggregateRoot, mockInterface } from '@tests/utils';
import { BikeRepositoryPort } from '../../database/ports/bike.repository.port';
import { ActivateBikeService } from './activate-bike.service';
import { BikeEntity } from '../../domain/bike.entity';
import { ActivateBikeCommand } from './activate-bike.command';
import { BikeOwnershipError } from '../../bike.errors';

describe('ActivateBikeService', () => {
  let service: ActivateBikeService;
  let bikeRepo: jest.Mocked<BikeRepositoryPort>;

  const ownerId = 'owner-123';
  const bikeId = 'bike-001';

  beforeEach(() => {
    bikeRepo = mockInterface<BikeRepositoryPort>();

    service = new ActivateBikeService(bikeRepo);
  });

  it('should activate the bike and return its id', async () => {
    const mockBike = mockAggregateRoot(BikeEntity, {
      ownerId,
      isActive: false,
      id: bikeId,
    });

    bikeRepo.findOneById.mockResolvedValue(mockBike);

    const command = new ActivateBikeCommand({
      bikeId,
      requesterId: ownerId,
    });

    const result = await service.execute(command);

    expect(bikeRepo.findOneById).toHaveBeenCalledWith(bikeId);
    expect(mockBike.activate).toHaveBeenCalled();
    expect(bikeRepo.update).toHaveBeenCalledWith(mockBike);
    expect(result).toEqual(mockBike.id);
  });

  it('should throw BikeOwnershipError if requester is not the owner', async () => {
    const mockBike = mockAggregateRoot(BikeEntity, {
      ownerId: 'someone-else',
    });

    bikeRepo.findOneById.mockResolvedValue(mockBike);

    const command = new ActivateBikeCommand({
      bikeId,
      requesterId: ownerId,
    });

    await expect(service.execute(command)).rejects.toThrow(BikeOwnershipError);
    expect(bikeRepo.update).not.toHaveBeenCalled();
  });
});
