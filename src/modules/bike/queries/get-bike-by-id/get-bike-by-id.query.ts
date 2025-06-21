import { QueryBase } from '@src/libs/ddd';

export class GetBikeByIdQuery extends QueryBase {
  readonly id: string;

  constructor(props: GetBikeByIdQuery) {
    super();
    this.id = props.id;
  }
}
