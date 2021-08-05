import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { Atom } from '../packlets/atom';
import { IFig, IFigOptions, toFig } from './fig';

export const atomFigProjection = <T1, T2 extends T1>(
  fig$: Atom<IFig<T1>>,
  options?: Partial<IFigOptions>
): MonoTypeOperatorFunction<T2> => {
  return (source: Observable<T2>) =>
    new Observable<T2>((subscriber) => {
      const $ = source.pipe(share());
      subscriber.add(
        toFig($, fig$.get().value, options).subscribe({
          error: (err) => subscriber.error(err),
          complete: () => subscriber.complete(),
          next: (fig) => fig$.set(fig),
        })
      );
      subscriber.add($.subscribe((value) => subscriber.next(value)));
    });
};
