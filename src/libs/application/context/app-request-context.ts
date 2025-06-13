/**
 * TODO: use CLS (Continuation-Local Storage) module to store per-request state (e.g. requestId,
 * userId, transction, context)
 */

import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { DataSource, EntityManager } from 'typeorm';

type RequestContextStore = {
  requestId: string;
  entityManager?: EntityManager;
};

@Injectable()
export class AppRequestContext {
  private static instance: AppRequestContext;

  private readonly asyncLocalStorage =
    new AsyncLocalStorage<RequestContextStore>();

  constructor(private readonly dataSource: DataSource) {
    AppRequestContext.instance = this;
  }

  // static accessor to get current context instance
  static get current(): AppRequestContext {
    if (!AppRequestContext.instance) {
      throw new Error('AppRequestContext has not been initialized yet.');
    }
    return AppRequestContext.instance;
  }

  // run a function in the context if a specific requestId
  runWithRequestContext<T>(requestId: string, fn: () => T): T {
    return this.asyncLocalStorage.run({ requestId }, fn);
  }

  // get current requestId from the context
  getRequestId(): string {
    return this.asyncLocalStorage.getStore()?.requestId ?? '';
  }

  /**
   * get the current EntityManager.
   * if a transaction is active for this request, returns the transactional EntityManager.
   * otherwise, returns a default manager (non-transactional).
   */
  getEntityManager(): EntityManager {
    const ctx = this.asyncLocalStorage.getStore();
    // no transaction in context, use default manager (will run queries directly)
    return ctx?.entityManager ?? this.dataSource.manager;
  }

  /**
   * execute the given function within a database transaction.
   * this will bind the transaction EntityManager to the AsyncLocalStorage context,
   * so that all repository calls inside `work` use the same transaction.
   */
  async runInTransaction<T>(work: () => Promise<T>): Promise<T> {
    const currentStore = this.asyncLocalStorage.getStore();
    if (!currentStore) {
      throw new Error('No request context available when starting transaction');
    }

    return this.dataSource.manager.transaction(async (transactionManager) => {
      const transactionalContext: RequestContextStore = {
        ...currentStore,
        entityManager: transactionManager,
      };

      // run the callback in the AsyncLocalStorage context:
      return await this.asyncLocalStorage.run(
        transactionalContext,
        async () => {
          // inside this callback, AppRequestContext.getEntityManager() will return the transaction's manager.
          const result = await work();
          return result;
        },
      );
    });
  }
}
