import { PaginatedParams, PaginatedQueryBase } from '@src/libs/ddd';
import { BikeTypes } from '../../domain/bike.types';

export class ListCustomerBikesQuery extends PaginatedQueryBase {
  readonly searchTerm?: string;

  readonly type?: BikeTypes;

  readonly enginePower?: number;

  readonly minPrice?: number;

  readonly maxPrice?: number;

  readonly rentalStart: Date;

  readonly rentalEnd: Date;

  constructor(props: PaginatedParams<ListCustomerBikesQuery>) {
    super(props);
    this.searchTerm = props.searchTerm;
    this.type = props.type;
    this.enginePower = props.enginePower;
    this.minPrice = props.minPrice;
    this.maxPrice = props.maxPrice;
    this.rentalStart = props.rentalStart;
    this.rentalEnd = props.rentalEnd;
  }
}
