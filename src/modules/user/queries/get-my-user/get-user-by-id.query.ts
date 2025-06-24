import { QueryBase } from '@src/libs/ddd';

export class GetUserByIdQuery extends QueryBase {
  readonly id: string;

  constructor(props: GetUserByIdQuery) {
    super();
    this.id = props?.id;
  }
}
