import { isError, TOption } from '@body-link/type-guards';
import { concat, EMPTY, Observable, of, throwError } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';

export interface IFig<Value = unknown> {
  value: Value;
  inProgress: boolean;
  error?: Error;
}

export function createFig(fig?: Partial<IFig<undefined>>): IFig<undefined>;
export function createFig<T>(): IFig<TOption<T>>;
export function createFig<T>(fig: Pick<IFig<T>, 'value'> & Partial<IFig<T>>): IFig<T>;
export function createFig<T>(fig?: Partial<IFig<T>>): IFig<TOption<T>> {
  return {
    value: undefined,
    inProgress: false,
    ...fig,
  };
}

export interface IFigOptions {
  skipValue: boolean;
  skipError: boolean;
  skipProgress: boolean;
  longProgress: boolean;
  errorHandlingStrategy: 'pass' | 'complete';
}

const figDefaultOptions: IFigOptions = {
  skipValue: false,
  skipError: false,
  skipProgress: false,
  longProgress: false,
  errorHandlingStrategy: 'complete',
};

export const toFig = <T>(
  source: Observable<T>,
  initialValue: T,
  options?: Partial<IFigOptions>
): Observable<IFig<T>> => {
  const { skipValue, skipError, skipProgress, longProgress, errorHandlingStrategy } = {
    ...figDefaultOptions,
    ...options,
  };

  if (skipValue && skipError && skipProgress) {
    return throwError(new Error("You don't need to use IFig if you skip every its' property"));
  }

  let fig = createFig<T>({ value: initialValue, inProgress: !skipProgress });

  return concat(
    of(fig),
    source.pipe(
      map((value) => {
        if (skipValue) {
          return fig;
        } else {
          const nextFig = { ...fig };
          nextFig.value = value;
          nextFig.inProgress = longProgress;
          fig = nextFig;
          return nextFig;
        }
      }),
      catchError((err) => {
        const error = isError(err) ? err : new Error(String(err));
        const nextFig = { ...fig };
        if (!skipError) {
          nextFig.error = error;
        }
        if (!skipProgress) {
          nextFig.inProgress = false;
        }
        fig = nextFig;
        return concat(of(fig), errorHandlingStrategy === 'pass' ? throwError(err) : EMPTY);
      })
    ),
    new Observable<IFig<T>>((subscriber) => {
      if (!skipProgress && fig.inProgress) {
        subscriber.next({ ...fig, inProgress: false });
      }
      subscriber.complete();
    })
  ).pipe(shareReplay({ bufferSize: 1, refCount: true }));
};
