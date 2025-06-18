import { AggregateId, AggregateRoot } from '@src/libs/ddd';
import {
  BikeProps,
  BikeTypes,
  CreateBikeProps,
  UpdateDetailsProps,
} from './bike.types';
import { randomUUID } from 'crypto';
import { RentalPeriod } from './value-objects/rental-period.value-object';
import { Price } from './value-objects/price.value-object';
import { ArgumentInvalidException } from '@src/libs/exceptions';

export class BikeEntity extends AggregateRoot<BikeProps> {
  protected readonly _id: AggregateId;

  static create(create: CreateBikeProps) {
    const id = randomUUID();

    const photoKeys = create.photoKeys ?? [];
    const thumbnailKey = create.thumbnailKey ?? photoKeys[0] ?? '';

    const props: BikeProps = {
      ...create,
      photoKeys,
      thumbnailKey,
      isActive: true,
    };
    const bike = new BikeEntity({ id, props });
    return bike;
  }

  get type(): BikeTypes {
    return this.props.type;
  }

  updateDetails({
    description,
    pricePerDay,
    enginePower,
    model,
    photoKeys,
    thumbnailKey,
  }: UpdateDetailsProps): void {
    this.props.description = description;
    this.props.pricePerDay = new Price(pricePerDay);
    if (enginePower !== undefined) {
      this.props.enginePower = enginePower;
    }
    if (model !== undefined) {
      this.props.model = model;
    }
    if (photoKeys) {
      this.props.photoKeys = photoKeys;
    }
    if (thumbnailKey) {
      this.props.thumbnailKey = thumbnailKey;
    }
  }

  /** Deactivate the bike listing (e.g., if the owner removes it or it's no longer available) */
  deactivate(): void {
    this.props.isActive = false;
  }

  activate(): void {
    this.props.isActive = true;
  }

  /** Check if this bike can be booked for a given period
   * (This method might use existing bookings if we have them loaded;
   * alternatively use AvailabilityService externally)
   */
  isAvaiableFor(
    period: RentalPeriod,
    extistingBookings: RentalPeriod[],
  ): boolean {
    return !extistingBookings.some((b) => b.overlaps(period));
  }

  validate(): void {
    if (
      this.props.photoKeys.length > 0 &&
      this.props.thumbnailKey &&
      !this.props.photoKeys.includes(this.props.thumbnailKey)
    ) {
      throw new ArgumentInvalidException(
        'Thumbnail must be one of the photoKeys',
      );
    }
  }
}
