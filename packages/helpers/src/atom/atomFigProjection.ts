import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { Atom } from '../packlets/atom';
import { IFig, IFigOptions, toFig } from './fig';

export const atomFigProjection = <T>(
  fig$: Atom<IFig<T>>,
  options?: Partial<IFigOptions>
): MonoTypeOperatorFunction<T> => {
  return (source: Observable<T>) =>
    new Observable<T>((subscriber) => {
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
