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

export class FullTextSearchStrategy<T extends ObjectLiteral>
  implements SearchStrategy<T>
{
  constructor(
    private fields: (keyof T)[],
    private language: string = 'english',
  ) {}

  apply(qb: SelectQueryBuilder<T>, term: string): void {
    const alias = qb.alias;
    const vectorExpr = this.fields
      .map((f) => `COALESCE(${alias}.${String(f)}, '')`)
      .join(" || ' ' || ");
    qb.andWhere(
      `to_tsvector(:lang, ${vectorExpr}) @@ plainto_tsquery(:lang, :query)`,
      { lang: this.language, query: term },
    );
  }
}
