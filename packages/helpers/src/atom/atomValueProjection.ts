import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Atom } from '../packlets/atom';

export const atomValueProjection =
  <T1, T2 extends T1>(atom: Atom<T1>): MonoTypeOperatorFunction<T2> =>
  (source: Observable<T2>) =>
    source.pipe(tap((n) => atom.set(n)));
