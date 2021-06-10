import { observe } from 'rxjs-marbles/jest';
import { defer, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { retryStrategy } from './retryStrategy';

describe('retryStrategy', () => {
  it(
    'should resolve in 3 attempts',
    observe(() => {
      let attempt = 0;
      const mock = jest.fn(() => {
        if (++attempt === 3) {
          return of(1);
        } else {
          throw new Error('Houston, we have a problem');
        }
      });
      return defer(mock).pipe(
        retryStrategy(),
        tap({
          next: (value) => {
            expect(attempt).toBe(3);
            expect(value).toBe(1);
          },
          complete: () => {
            expect(attempt).toBe(3);
            expect(mock).toBeCalledTimes(3);
          },
        })
      );
    }),
    10000
  );

  it(
    'should fail in 3 attempts',
    observe(() => {
      let attempt = 0;
      const mock = jest.fn(() => {
        ++attempt;
        throw new Error('Houston, we have a problem');
      });
      return defer(mock).pipe(
        retryStrategy(2),
        catchError((value) => {
          expect(attempt).toBe(3);
          expect(value).toBeInstanceOf(Error);
          return of(1);
        }),
        tap({
          next: (value) => {
            expect(attempt).toBe(3);
            expect(value).toBe(1);
          },
          complete: () => {
            expect(attempt).toBe(3);
            expect(mock).toBeCalledTimes(3);
          },
        })
      );
    }),
    10000
  );
});
