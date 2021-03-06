/* eslint-disable @typescript-eslint/no-explicit-any */
import { SimpleCache } from '../../simple-cache';
import { createModify } from '../utils';
import { Optic } from '../Optic';
import { Prism } from '../Prism';

// @NOTE lens and prism are monomorphic: can't change the type of
// focused value on update

/**
 * The lens interface.
 *
 * Lens is a kind of functional reference – an abstraction that allows
 * you to operate on part(s) of a value in a purely-functional setting.
 *
 * Read more here: https://en.wikibooks.org/wiki/Haskell/Lenses_and_functional_references
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export interface Lens<TSource, T> extends Optic<TSource, T, T> {
  compose<U>(next: Lens<T, U>): Lens<TSource, U>;
  compose<U>(next: Prism<T, U>): Prism<TSource, U>;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Lens {
  /**
   * Create a lens.
   *
   * @export
   * @template O type of the source
   * @template P type of the destination
   * @param getter a getter function
   * @param setter a setter function
   * @returns a lens that operates by given getter and setter
   */
  export function create<TSource, T>(
    getter: (s: TSource) => T,
    setter: (v: T, s: TSource) => TSource
  ): Lens<TSource, T> {
    const cache = new SimpleCache<any, Lens<TSource, any>>((next) =>
      create(
        (s: TSource) => next.get(getter(s)),
        (v: any, s: TSource) => setter(next.set(v, getter(s)), s)
      )
    );

    return {
      get: getter,
      set: setter,
      modify: createModify(getter, setter),

      compose<U>(next: Lens<T, U>): Lens<TSource, U> {
        return cache.getOrCreate(next);
      },
    };
  }

  /**
   * Compose several lenses, where each subsequent lens' state type is the previous
   * lens' output type.
   *
   * You need to explicitly say what will be the type of resulting lens, and you
   * need to do it right as there are no guarantees at compile time.
   *
   * @static
   * @template S the resulting lens' state
   * @template A the resulting lens' output
   */
  export function compose<T, U>(l: Lens<T, U>): Lens<T, U>;

  export function compose<T1, T2, U>(l1: Lens<T1, T2>, l2: Lens<T2, U>): Lens<T1, U>;

  export function compose<T1, T2, T3, U>(l1: Lens<T1, T2>, l2: Lens<T2, T3>, l3: Lens<T3, U>): Lens<T1, U>;

  export function compose<T1, T2, T3, T4, U>(
    l1: Lens<T1, T2>,
    l2: Lens<T2, T3>,
    l3: Lens<T3, T4>,
    l4: Lens<T4, U>
  ): Lens<T1, U>;

  export function compose<T1, T2, T3, T4, T5, U>(
    l1: Lens<T1, T2>,
    l2: Lens<T2, T3>,
    l3: Lens<T3, T4>,
    l4: Lens<T4, T5>,
    l5: Lens<T5, U>
  ): Lens<T1, U>;

  export function compose<T, U>(...lenses: Lens<any, any>[]): Lens<T, U>;

  export function compose<T, U>(...lenses: Lens<any, any>[]): Lens<T, U> {
    if (lenses.length === 0) {
      throw new TypeError('Can not compose zero lenses. You probably want `Lens.identity`.');
    } else if (lenses.length === 1) {
      return lenses[0];
    } else {
      return lenses.slice(1).reduce((c, l) => c.compose(l), lenses[0]) as Lens<T, U>;
    }
  }

  const _identity: Lens<any, any> = create<any, any>(
    (s) => s,
    (v) => v
  );

  /**
   * The identity lens – a lens that reads and writes the object itself.
   */
  export function identity<T>(): Lens<T, T> {
    return _identity as Lens<T, T>;
  }

  const _nothing: Prism<any, any> = Prism.create(
    () => undefined,
    (v, s) => s
  );

  /**
   * A lens that always returns `undefined` on `get` and does no change on `set`.
   */
  export function nothing<TSource, T>(): Prism<TSource, T> {
    return _nothing as Prism<TSource, T>;
  }
}
