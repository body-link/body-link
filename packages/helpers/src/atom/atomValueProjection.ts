import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import { Atom } from '../packlets/atom';

export const atomValueProjection =
  <T>(atom$: Atom<T>): MonoTypeOperatorFunction<T> =>
  (source: Observable<T>) =>
    new Observable<T>((subscriber) => {
      subscriber.add(source.subscribe((t) => atom$.set(t)));
    });
