export type SortDirection = 'ASC' | 'DESC';

export type FilterOperator =
  | '='
  | '!='
  | '>'
  | '>='
  | '<'
  | '<='
  | 'IN'
  | 'BETWEEN'
  | 'LIKE'
  | 'ILIKE';

export interface SortOption<T> {
  field: keyof T;
  direction: SortDirection;
}

export interface FilterCondition<T> {
  field: keyof T;
  operator: FilterOperator;
  value: any;
}

export interface QueryOptions {
  limit?: number;
  offset?: number;
  page?: number;
}
