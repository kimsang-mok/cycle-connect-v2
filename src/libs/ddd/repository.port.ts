/*  Most of repositories will probably need generic 
    save/find/delete operations, so it's easier
    to have some shared interfaces.
    More specific queries should be defined
    in a respective repository.
*/

export class Paginated<T> {
  readonly page: number;
  readonly limit: number;
  readonly total: number;
  readonly totalPages: number;
  readonly data: readonly T[];

  constructor(props: Paginated<T>) {
    this.page = props.page;
    this.limit = props.limit;
    this.total = props.total;
    this.totalPages = props.totalPages;
    this.data = props.data;
  }
}

export type OrderBy = { field: string | true; param: 'ASC' | 'DESC' };

export type PaginatedQueryParams = {
  limit: number;
  page: number;
  offset: number;
  orderBy: OrderBy;
};

export interface RepositoryPort<Entity> {
  insert(entity: Entity | Entity[]): Promise<void>;
  update(entity: Entity): Promise<void>;
  findOneById(id: string | number): Promise<Entity | null>;
  findAll(): Promise<Entity[]>;
  delete(entity: Entity): Promise<boolean>;
  transaction<T>(handler: () => Promise<T>): Promise<T>;
}
