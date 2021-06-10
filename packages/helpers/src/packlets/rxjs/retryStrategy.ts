import { MonoTypeOperatorFunction, throwError, timer } from 'rxjs';
import { mergeMap, retryWhen } from 'rxjs/operators';

// 60 attempts its ~1h and 1m
export const retryStrategy = <T>(maxAttempts = 60): MonoTypeOperatorFunction<T> => {
  return retryWhen<T>((attempts) =>
    attempts.pipe(
      mergeMap((error, i) => (i < maxAttempts ? timer((i < 7 ? (i + 1) * 2 : 60) * 1000) : throwError(error)))
    )
  );
};
