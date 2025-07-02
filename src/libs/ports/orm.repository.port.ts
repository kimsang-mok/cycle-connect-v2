export interface OrmRepositoryPort<OrmEntity> {
  findOne(options: any): Promise<OrmEntity | null>;

  findOneById(id: string | number): Promise<OrmEntity | null>;

  findAll(options?: any): Promise<OrmEntity[]>;

  insert(entity: OrmEntity | OrmEntity[]): Promise<void>;

  update(id: string | number, partialEntity: Partial<OrmEntity>): Promise<void>;

  delete(id: string | number): Promise<boolean>;

  transaction<T>(work: () => Promise<T>): Promise<T>;
}
