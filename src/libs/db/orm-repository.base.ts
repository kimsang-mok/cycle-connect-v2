import {
  EntityManager,
  FindManyOptions,
  FindOneOptions,
  ObjectLiteral,
  ObjectType,
  Repository,
} from 'typeorm';
import { AppRequestContext } from '../application/context';
import { LoggerPort } from '../ports/logger.port';
import { OrmRepositoryPort } from '../ports/orm.repository.port';

/**
 * simple base repository (straightforward data access for non-domain modules)
 */
export abstract class OrmRepositoryBase<OrmEntity extends ObjectLiteral>
  implements OrmRepositoryPort<OrmEntity>
{
  protected abstract readonly entityClass: ObjectType<OrmEntity>;

  protected get requestId(): string {
    return this.appContext.getRequestId();
  }

  protected get appContext(): AppRequestContext {
    return AppRequestContext.current;
  }

  protected constructor(protected readonly logger: LoggerPort) {}

  protected get manager(): EntityManager {
    return this.appContext.getEntityManager();
  }

  protected get repository(): Repository<OrmEntity> {
    return this.manager.getRepository<OrmEntity>(this.entityClass);
  }

  async findOne(options: FindOneOptions<OrmEntity>): Promise<OrmEntity | null> {
    return this.repository.findOne(options);
  }

  async findOneById(id: string | number): Promise<OrmEntity | null> {
    return this.repository.findOne({ where: { id } } as any);
  }

  async findAll(
    options: FindManyOptions<OrmEntity> = {},
  ): Promise<OrmEntity[]> {
    return this.repository.find(options);
  }

  async insert(entity: OrmEntity | OrmEntity[]): Promise<void> {
    const entities = Array.isArray(entity) ? entity : [entity];
    await this.repository.insert(entities);
  }

  async update(
    id: string | number,
    partialEntity: Partial<OrmEntity>,
  ): Promise<void> {
    const result = await this.repository.update(id, partialEntity);
    if (result.affected === 0) {
      this.logger.debug(
        `[${this.requestId}] Update failed: entity ${id} not found.`,
      );
    }
  }

  async delete(id: string | number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (
      result.affected !== undefined &&
      result.affected !== null &&
      result.affected > 0
    );
  }

  async transaction<T>(work: () => Promise<T>): Promise<T> {
    const requestId = this.requestId;
    this.logger.debug(`[${requestId}] Transaction started`);

    try {
      const result = await this.appContext.runInTransaction(work);
      this.logger.debug(`[${requestId}] Transaction committed`);
      return result;
    } catch (error) {
      this.logger.debug(`[${requestId}] Transaction rolled back`);
      throw error;
    }
  }
}
