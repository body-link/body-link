import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import { tap } from "rxjs/operators";
import { Atom } from '../packlets/atom';

export const atomValueProjection =
  <T>(atom$: Atom<T>): MonoTypeOperatorFunction<T> => (
    source: Observable<T>
  ) => source.pipe(tap((n) => atom$.set(n)));
