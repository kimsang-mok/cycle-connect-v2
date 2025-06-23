/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Brackets, ObjectLiteral, SelectQueryBuilder } from 'typeorm';

export interface SearchStrategy<T extends ObjectLiteral> {
  apply(qb: SelectQueryBuilder<T>, searchTerm: string): void;
}

export class ILikeSearchStrategy<T extends ObjectLiteral>
  implements SearchStrategy<T>
{
  constructor(private fields: (keyof T)[]) {}
  apply(qb: SelectQueryBuilder<T>, term: string): void {
    const param = `${term}%`;

    qb.andWhere(
      new Brackets((qbInner) => {
        this.fields.forEach((field, idx) => {
          const alias = qb.alias;
          const condition = `${alias}.${String(field)} ILIKE :searchTerm${idx}`;
          idx === 0
            ? qbInner.where(condition, { [`searchTerm${idx}`]: param })
            : qbInner.orWhere(condition, { [`searchTerm${idx}`]: param });
        });
      }),
    );
  }
}

/**
 * dynamic full-text search strategy
 *
 * this computes a `tsvector` on-the-fly from the specified fields
 * flexible — no need for `search_vector` column or trigger
 * slower for large datasets — can't use GIN index
 */
export class DynamicFullTextSearchStrategy<T extends ObjectLiteral>
  implements SearchStrategy<T>
{
  constructor(
    private fields: (keyof T)[],
    private language: string = 'english',
  ) {}

  apply(qb: SelectQueryBuilder<T>, term: string): void {
    const alias = qb.alias;

    // build a tsvector expression by combining all target fields
    const vectorExpr = this.fields
      .map((f) => `COALESCE(${alias}.${String(f)}, '')`)
      .join(" || ' ' || ");

    qb.andWhere(
      `to_tsvector(:lang, ${vectorExpr}) @@ plainto_tsquery(:lang, :query)`,
      {
        lang: this.language,
        query: term,
      },
    );
  }
}

/**
 * pre-computed full-text search strategy
 *
 * this uses a dedicated `tsvector` column (e.g. `search_vector`)
 * fast — uses GIN index for performance
 * requires DB migration and trigger to maintain `search_vector`
 */
export class PrecomputedFullTextSearchStrategy<T extends ObjectLiteral>
  implements SearchStrategy<T>
{
  constructor(
    private columnName: keyof T = 'search_vector',
    private language: string = 'english',
  ) {}

  apply(qb: SelectQueryBuilder<T>, term: string): void {
    const alias = qb.alias;

    // use precomputed tsvector column (must be indexed via GIN)
    qb.andWhere(
      `${alias}.${String(this.columnName)} @@ plainto_tsquery(:lang, :query)`,
      {
        lang: this.language,
        query: term,
      },
    );
  }
}
