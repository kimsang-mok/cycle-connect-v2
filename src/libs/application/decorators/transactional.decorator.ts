import { AppRequestContext } from '../context';

export function Transactional(): MethodDecorator {
  return function (target, propertyKey, descriptor: PropertyDescriptor) {
    const original = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const appContext = this.appContext ?? AppRequestContext.current;
      const requestId = appContext.getRequestId?.();

      try {
        console.debug(`[${requestId}] Transaction started`);

        const result = await appContext.runInTransaction(() =>
          original.apply(this, args),
        );
        console.debug(`[${requestId}] Transaction committed`);
        return result;
      } catch (error) {
        console.debug(
          `[${requestId}] Transaction rolled back: `,
          error.message,
        );
        throw error;
      }
    };
  };
}
