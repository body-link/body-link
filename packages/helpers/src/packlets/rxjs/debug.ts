import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import { dematerialize, materialize, tap } from 'rxjs/operators';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debug = <T>(...args: any[]): MonoTypeOperatorFunction<T> => {
  return (source: Observable<T>) =>
    source.pipe(
      materialize(),
      tap((n) => console.log(...args, n)),
      dematerialize()
    );
};
