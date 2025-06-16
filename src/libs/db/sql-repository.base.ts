import {
  EntityManager,
  FindManyOptions,
  FindOneOptions,
  ObjectType,
  QueryFailedError,
  ObjectLiteral,
} from 'typeorm';
import { AggregateRoot, Mapper, RepositoryPort } from '../ddd';
import { LoggerPort } from '../ports/logger.port';
import { AppRequestContext } from '../application/context';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConflictException, NotFoundException } from '../exceptions';

/**
 * base repository implementation using TypeORM.
 * @typeParam OrmEntity - TypeORM entity (database model)
 * @typeParam DomainEntity - Domain model (AggregateRoot)
 */
export abstract class SqlRepositoryBase<
  DomainEntity extends AggregateRoot<any>,
  OrmEntity extends ObjectLiteral,
> implements RepositoryPort<DomainEntity>
{
  protected abstract readonly entityClass: ObjectType<OrmEntity>;

  protected get requestId(): string {
    return this.appContext.getRequestId();
  }

  protected get appContext(): AppRequestContext {
    return AppRequestContext.current;
  }

  protected constructor(
    protected readonly mapper: Mapper<DomainEntity, OrmEntity>,
    protected readonly eventEmitter: EventEmitter2,
    protected readonly logger: LoggerPort,
  ) {}

  /**
   * util to obtain the appropriate EntityManager:
   * uses transaction EntityManager if a transaction is in progress, otherwise the DataSource's manager.
   */
  protected get manager(): EntityManager {
    return this.appContext.getEntityManager();
  }

  protected get repository() {
    return this.manager.getRepository<OrmEntity>(this.entityClass);
  }

  async findOneById(id: string | number): Promise<DomainEntity | null> {
    const entity = await this.repository.findOne({
      where: { id } as any,
    } as FindOneOptions<OrmEntity>);
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async findAll(
    options: FindManyOptions<OrmEntity> = {},
  ): Promise<DomainEntity[]> {
    const entities = await this.repository.find(options);
    return entities.map((entity) => this.mapper.toDomain(entity));
  }

  /**
   * insert (save) a new entity into the database
   */
  async insert(entity: DomainEntity | DomainEntity[]): Promise<void> {
    const entities = Array.isArray(entity) ? entity : [entity];

    try {
      for (const entity of entities) {
        entity.validate();
        const record = this.mapper.toPersistence(entity);
        await this.repository.insert(record);
      }
      await Promise.all(
        entities.map((entity) => this.publishDomainEvent(entity)),
      );
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as any).code === '23505'
      ) {
        this.logger.debug(
          `[${this.requestId}] Duplicate key violatin: ${error.message}`,
        );
        throw new ConflictException('Record already exists');
      }
      throw error;
    }

    for (const agg of entities) {
      agg.validate?.();
      const ormEntity = this.mapper.toPersistence(agg);
      await this.repository.save(ormEntity);
    }

    await Promise.all(
      entities.map((entity) => {
        this.publishDomainEvent(entity);
      }),
    );
  }

  async update(entity: DomainEntity): Promise<void> {
    entity.validate();

    const result = await this.repository.update(
      entity.id,
      this.mapper.toPersistence(entity),
    );

    if (result.affected === 0) {
      throw new NotFoundException(`Entity ${entity.id} not found`);
    }

    await this.publishDomainEvent(entity);
  }

  async delete(entity: DomainEntity): Promise<boolean> {
    entity.validate();
    const result = await this.repository.delete(entity.id);

    if (result.affected && result.affected > 0) {
      await this.publishDomainEvent(entity);
      return true;
    }
    return false;
  }

  async publishDomainEvent(entity: DomainEntity) {
    return entity.publishEvents(this.requestId, this.logger, this.eventEmitter);
  }

  /**
   * @deprecated use @Transactional() decorator instead.
   */
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
