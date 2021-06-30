import { Observable } from 'rxjs';
import { TOption } from '@body-link/type-guards';
import { Lens, Prism } from '../lens';

/**
 * Read-only atom.
 *
 * @template T type of atom values
 */
export interface ReadOnlyAtom<T> extends Observable<T> {
  /**
   * Get the current atom value.
   *
   * @example
   * import { Atom } from '@rixio/atom'
   *
   * const a = Atom.create(5)
   * a.get()
   * // => 5
   *
   * a.set(6)
   * a.get()
   * // => 6
   * @returns current value
   */
  get(): T;

  /**
   * View this atom as is.
   * Doesn't seem to make sense, but it is needed to be used from
   * inheriting atom classes to conveniently go from read/write to
   * read-only atom.
   *
   * @example
   * import { Atom } from '@rixio/atom'
   *
   * const source = Atom.create(5)
   * const view = source.view()
   *
   * view.get()
   * // => 5
   *
   * source.set(6)
   * view.get()
   * // => 6
   *
   * view.set(7) // compilation error
   * @returns this atom
   */
  view(): ReadOnlyAtom<T>;

  /**
   * View this atom through a given mapping.
   *
   * @example
   * import { Atom } from '@rixio/atom'
   *
   * const a = Atom.create(5)
   * const b = a.view(x => x * 2)
   *
   * a.get()
   * // => 5
   * b.get()
   * // => 10
   *
   * a.set(10)
   *
   * a.get()
   * // => 10
   * b.get()
   * // => 20
   * @param getter getter function that defines the view
   * @returns atom viewed through the given transformation
   */
  view<U>(getter: (x: T) => U): ReadOnlyAtom<U>;

  /**
   * View this atom through a given lens.
   *
   * @param lens lens that defines the view
   * @returns atom viewed through the given transformation
   */
  view<U>(lens: Lens<T, U>): ReadOnlyAtom<U>;

  /**
   * View this atom through a given prism.
   *
   * @param prism prism that defines the view
   * @returns atom viewed through the given transformation
   */
  view<U>(prism: Prism<T, U>): ReadOnlyAtom<TOption<U>>;

  /**
   * View this atom at a property of given name.
   */
  view<K extends keyof T>(k: K): ReadOnlyAtom<T[K]>;

  /**
   * View this atom at a give property path.
   */
  view<K1 extends keyof T, K2 extends keyof T[K1]>(k1: K1, k2: K2): ReadOnlyAtom<T[K1][K2]>;

  /**
   * View this atom at a give property path.
   */
  view<K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2]>(
    k1: K1,
    k2: K2,
    k3: K3
  ): ReadOnlyAtom<T[K1][K2][K3]>;

  /**
   * View this atom at a give property path.
   */
  view<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3]
  >(
    k1: K1,
    k2: K2,
    k3: K3,
    k4: K4
  ): ReadOnlyAtom<T[K1][K2][K3][K4]>;

  /**
   * View this atom at a give property path.
   */
  view<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4]
  >(
    k1: K1,
    k2: K2,
    k3: K3,
    k4: K4,
    k5: K5
  ): ReadOnlyAtom<T[K1][K2][K3][K4][K5]>;
}

/**
 * A read/write atom.
 *
 * @template T type of atom values
 */
export interface Atom<T> extends ReadOnlyAtom<T> {
  /**
   * Modify atom value.
   *
   * The update function should be:
   * - referentially transparent: return same result for same arguments
   * - side-effect free: don't perform any mutations (including calling
   *   Atom.set/Atom.modify) and side effects
   *
   * @param updateFn value update function
   */
  modify(updateFn: (currentValue: T) => T): void;

  /**
   * Set new atom value.
   *
   * @param newValue new value
   */
  set(newValue: T): void;

  /**
   * Create a lensed atom by supplying a lens.
   *
   * @template U destination value type
   * @param lens a lens
   * @returns a lensed atom
   */
  lens<U>(lens: Lens<T, U>): Atom<U>;

  /**
   * Create a lensed atom that's focused on a property of given name.
   */
  lens<K extends keyof T>(k: K): Atom<T[K]>;

  /**
   * Create a lensed atom that's focused on a given property path.
   */
  lens<K1 extends keyof T, K2 extends keyof T[K1]>(k1: K1, k2: K2): Atom<T[K1][K2]>;

  /**
   * Create a lensed atom that's focused on a given property path.
   */
  lens<K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2]>(
    k1: K1,
    k2: K2,
    k3: K3
  ): Atom<T[K1][K2][K3]>;

  /**
   * Create a lensed atom that's focused on a given property path.
   */
  lens<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3]
  >(
    k1: K1,
    k2: K2,
    k3: K3,
    k4: K4
  ): Atom<T[K1][K2][K3][K4]>;

  /**
   * Create a lensed atom that's focused on a given property path.
   */
  lens<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4]
  >(
    k1: K1,
    k2: K2,
    k3: K3,
    k4: K4,
    k5: K5
  ): Atom<T[K1][K2][K3][K4][K5]>;
}
