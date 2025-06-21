export enum SortDirection {
  asc = 'ASC',
  desc = 'DESC',
}

export enum FilterOperator {
  equal = '=',
  notEqual = '!=',
  greaterThan = '>',
  greaterThanEqual = '>=',
  lessThan = '<',
  lessThanEqual = '<=',
  in = 'IN',
  between = 'BETWEEN',
  like = 'LIKE',
  iLike = 'ILIKE',
}

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
