import { CreateBikeService } from './create-bike.service';
import { CreateBikeCommand } from './create-bike.command';
import { BikeRepositoryPort } from '../../database/ports/bike.repository.port';
import { BikeTypes } from '../../domain/bike.types';
import { Price } from '../../domain/value-objects/price.value-object';
import { mockAggregateRoot, mockInterface } from '@tests/utils';
import { BikeEntity } from '../../domain/bike.entity';
import { ArgumentInvalidException } from '@src/libs/exceptions';

describe('CreateBikeService', () => {
  let service: CreateBikeService;
  let bikeRepo: jest.Mocked<BikeRepositoryPort>;

  const bikeCommandProps = {
    ownerId: 'user-123',
    type: BikeTypes.motorbike,
    model: 'Honda Wave',
    enginePower: 125,
    description: 'A fuel-efficient bike',
    pricePerDay: 12.5,
    photoKeys: ['uploads/user-123/photo1.jpg'],
    thumbnailKey: 'uploads/user-123/photo1.jpg',
  };

  beforeEach(async () => {
    bikeRepo = mockInterface<BikeRepositoryPort>();

    service = new CreateBikeService(bikeRepo);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create and insert a bike, then return its id', async () => {
    const command = new CreateBikeCommand(bikeCommandProps);

    const bikeId = 'mock-bike-id';

    const mockBike = mockAggregateRoot(BikeEntity, {
      ...command,
      pricePerDay: new Price(command.pricePerDay),
      id: bikeId,
    });

    jest.spyOn(BikeEntity, 'create').mockReturnValue(mockBike);

    const result = await service.execute(command);

    expect(typeof result).toBe('string');
    expect(bikeRepo.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        getProps: expect.any(Function),
        get id() {
          return expect.any(String);
        },
      }),
    );
    expect(result).toEqual(bikeId);
  });

  it('should throw an error if thumbnailKey is not in photoKeys', async () => {
    const command = new CreateBikeCommand({
      ...bikeCommandProps,
      thumbnailKey: 'uploads/user-123/photo2.jpg', // not in photoKeys
    });

    await expect(service.execute(command)).rejects.toThrow(
      ArgumentInvalidException,
    );

    expect(bikeRepo.insert).not.toHaveBeenCalled();
  });
});
