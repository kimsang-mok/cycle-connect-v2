import { QueryBase } from '@src/libs/ddd';

export class GetActiveBookingsByBikeIdQuery extends QueryBase {
  readonly bikeId: string;

  constructor(props: GetActiveBookingsByBikeIdQuery) {
    super();
    this.bikeId = props.bikeId;
  }
}
