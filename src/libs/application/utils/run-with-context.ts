import { Observable } from 'rxjs';
import { AppRequestContext } from '../context';

/**
 * create new observable that runs inside the context
 * https://stackoverflow.com/a/72411190
 */
export function runWithContext<T>(
  appContext: AppRequestContext,
  requestId: string,
  factory: () => Observable<T>,
): Observable<T> {
  return new Observable((subscriber) => {
    appContext.runWithRequestContext(requestId, () => {
      const subscription = factory().subscribe({
        next: (value) => subscriber.next(value),
        error: (err) => subscriber.error(err),
        complete: () => subscriber.complete(),
      });

      return () => subscription.unsubscribe();
    });
  });
}
