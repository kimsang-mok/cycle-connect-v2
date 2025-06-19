import { Price } from '@src/modules/bike/domain/value-objects/price.value-object';
import { RentalPeriod } from '@src/modules/bike/domain/value-objects/rental-period.value-object';

export enum BookingStatus {
  confirmed = 'confirmed',
  cancelled = 'cancelled',
  completed = 'completed',
}

export interface BookingProps {
  bikeId: string;
  customerName: string;
  period: RentalPeriod;
  status: BookingStatus;
  totalPrice: Price;
}

export interface CreateBookingProps {
  bikeId: string;
  customerName: string;
  period: RentalPeriod;
  totalPrice: Price;
}
