import { DataSource, ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { SearchStrategy } from './search-strategies';
import {
  FilterCondition,
  FilterOperator,
  QueryOptions,
  SortOption,
} from './query.types';
import { Paginated } from '../ddd';

export class QueryUtil<T extends ObjectLiteral> {
  private qb: SelectQueryBuilder<T>;

  constructor(
    private dataSource: DataSource,
    private entity: { new (): T },
    alias: string = 'entity',
  ) {
    this.qb = this.dataSource.getRepository(entity).createQueryBuilder(alias);
  }

  search(strategy: SearchStrategy<T>, term?: string): this {
    if (term === undefined) return this;
    strategy.apply(this.qb, term);
    return this;
  }

  filter({ field, operator, value }: FilterCondition<T>): this {
    if (value === undefined) return this;

    const alias = this.qb.alias;

    const paramKey = `${String(field)}_${operator.replace(/\W/g, '')}_${Math.random()
      .toString(36)
      .substring(2, 6)}`;

    switch (operator) {
      case FilterOperator.equal:
      case FilterOperator.greaterThan:
      case FilterOperator.lessThan:
      case FilterOperator.greaterThanEqual:
      case FilterOperator.lessThanEqual:
        this.qb.andWhere(`${alias}.${String(field)} ${operator} :${paramKey}`, {
          [paramKey]: value,
        });
        break;
      case FilterOperator.notEqual:
        this.qb.andWhere(`${alias}.${String(field)} <> :${paramKey}`, {
          [paramKey]: value,
        });
        break;
      case FilterOperator.in:
        this.qb.andWhere(`${alias}.${String(field)} IN (:...${paramKey})`, {
          [paramKey]: value,
        });
        break;
      case FilterOperator.between:
        this.qb.andWhere(
          `${alias}.${String(field)} BETWEEN :${paramKey}_start AND :${paramKey}_end`,
          {
            [`${paramKey}_start`]: value[0],
            [`${paramKey}_end`]: value[1],
          },
        );
        break;
      case FilterOperator.like:
      case FilterOperator.iLike:
        this.qb.andWhere(`${alias}.${String(field)} ${operator} :${paramKey}`, {
          [paramKey]: value,
        });
        break;
    }

    return this;
  }

  sort(sorts: SortOption<T>[]): this {
    sorts.forEach(({ field, direction }, i) => {
      const alias = this.qb.alias;
      const fieldName = `${alias}.${String(field)}`;
      if (i === 0) {
        this.qb.orderBy(fieldName, direction);
      } else {
        this.qb.addOrderBy(fieldName, direction);
      }
    });
    return this;
  }

  custom(fn: (qb: SelectQueryBuilder<T>) => void): this {
    fn(this.qb);
    return this;
  }

  paginate(options: QueryOptions) {
    if (options.page !== undefined && options.limit !== undefined) {
      this.qb.skip(options.page * options.limit);
    } else if (options.offset !== undefined) {
      this.qb.skip(options.offset);
    }

    if (options.limit !== undefined) {
      this.qb.take(options.limit);
    }

    return this;
  }

  async execute(): Promise<Paginated<T>> {
    const [data, total] = await this.qb.getManyAndCount();
    const limit = this.qb.expressionMap.take ?? 0;
    const offset = this.qb.expressionMap.skip ?? 0;
    const page = limit > 0 ? Math.floor(offset / limit) + 1 : 1;
    const totalPages = limit > 0 ? Math.ceil(total / limit) : 1;

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }
}
