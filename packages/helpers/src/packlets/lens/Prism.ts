import { TOption } from '@body-link/type-guards';
import { Lens } from './Lens';
import { Optic } from './Optic';
import { createModify } from './utils';

export interface Prism<TSource, T> extends Optic<TSource, TOption<T>, T> {
  compose<U>(next: Lens<T, U>): Prism<TSource, U>;

  compose<U>(next: Lens<TOption<T>, U>): Lens<TSource, U>;

  compose<U>(next: Prism<T, U>): Prism<TSource, U>;
}

export namespace Prism {
  export function create<TSource, T>(
    getter: (s: TSource) => TOption<T>,
    setter: (v: T, s: TSource) => TSource
  ): Prism<TSource, T> {
    return {
      get: getter,
      set: setter,
      modify: createModify(getter, setter),

      compose<U>(next: Lens<T, U> | Prism<T, U>): Prism<TSource, U> {
        // no runtime dispatch – the implementation works for both
        // lens and prism argument
        return create(
          (s: TSource) => {
            const x = getter(s);
            return x !== undefined ? next.get(x) : undefined;
          },
          (v: U, s: TSource) => {
            const x = getter(s);
            return x !== undefined ? setter(next.set(v, x), s) : s;
          }
        );
      },
    };
  }
}
