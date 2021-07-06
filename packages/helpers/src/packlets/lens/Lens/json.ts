/* eslint-disable @typescript-eslint/no-explicit-any */
import { isDefined, TOption } from '@body-link/type-guards';
import { Lens } from './base';
import { Prism } from '../Prism';
import { setKey, structEq } from '../utils';
import { SimpleCache } from '../../simple-cache';

const keyCache: SimpleCache<string, Lens<any, any>> = new SimpleCache((key) =>
  Lens.create(
    (s) => s[key],
    (v, s) => setKey(key, v, s)
  )
);

const indexCache: SimpleCache<number, Prism<any[], any>> = new SimpleCache((index) =>
  Prism.create(
    (xs) => xs[index],
    (v, xs) => {
      if (xs.length <= index) {
        return xs.concat(Array(index - xs.length), [v]);
      } else if (structEq(v, xs[index])) {
        return xs;
      } else {
        return xs.slice(0, index).concat([v], xs.slice(index + 1));
      }
    }
  )
);

// @NOTE only need this interface to add JSDocs for this call.
// eslint-disable-next-line @typescript-eslint/naming-convention
export interface KeyImplFor<TObject> {
  /**
   * Create a lens focusing on a key of an object.
   *
   * Requires two subsequent calls, first with only a type argument and no function
   * arguments and second with the key argument.
   *
   * This enables better auto-completion, and is required because TypeScript does not
   * allow to specify only some of the type arguments.
   *
   * This is the second call, where you supply the key argument.
   * @example
   * interface SomeObject {
   *   someProp: number
   * }
   *
   * const lens = Lens.key<SomeObject>()('someProp')
   */ <K extends keyof TObject>(k: K): Lens<TObject, TObject[K]>;
}

/**
 * Create a prism focusing on a key of a dictionary.
 *
 * @param k the key to focus on
 */
export function keyImpl<TValue = any>(k: string): Prism<{ [k: string]: TValue }, TValue>;

/**
 * Create a lens focusing on a key of an object.
 *
 * Requires two subsequent calls, first with only a type argument and no function
 * arguments and second with the key argument.
 *
 * This enables better auto-completion, and is required because TypeScript does not
 * allow to specify only some of the type arguments.
 *
 * This is the first call, where you only supply the type argument.
 *
 * @example
 * interface SomeObject {
 *   someProp: number
 * }
 *
 * const lens = Lens.key<SomeObject>()('someProp')
 * @template TObject type of the data structure the lens is focusing into
 */
// @NOTE we're doing this in two subsequent function applications because TS can either
// infer all type parameters or none, and in this case there's nothing for it to infer the
// TObject parameter from.
//
// By doing this in two function applications we can make TS infer they key type parameter
// (K), which enables auto-completion for keys without needing to also state the key twice,
// once as a type argument, and once as a function argument.
//
// Without this hack, it would look like this:
//   keyImpl<SomeObject, 'someKey'>('someKey')
//
// Instead, we get this:
//   keyImpl<SomeObject>()('someKey')
//
// Pretty cool!
export function keyImpl<TObject = any>(): KeyImplFor<TObject>;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function keyImpl<TObject>(k?: string) {
  return k === undefined
    ? // type-safe key
      <K extends keyof TObject>(k: K): Lens<TObject, TObject[K]> =>
        keyCache.getOrCreate(k as string) as Lens<TObject, TObject[K]>
    : // untyped key
      keyCache.getOrCreate(k);
}

export function indexImpl<TItem>(i: number): Prism<TItem[], TItem> {
  if (i < 0) {
    throw new TypeError(`${i} is not a valid array index, expected >= 0`);
  }
  return indexCache.getOrCreate(i);
}

export function withDefaultImpl<T>(defaultValue: T): Lens<TOption<T>, T> {
  return Lens.create<TOption<T>, T>(
    (s) => (isDefined(s) ? s : defaultValue),
    (v) => v
  );
}

function choose<T, U>(getLens: (state: T) => Lens<T, U>): Lens<T, U> {
  return Lens.create(
    (s: T) => getLens(s).get(s),
    (v: U, s: T) => getLens(s).set(v, s)
  );
}

export function replaceImpl<T>(originalValue: T, newValue: T): Lens<T, T> {
  return Lens.create<T, T>(
    (state) => (structEq(state, originalValue) ? newValue : state),
    (nextValue, state) => {
      const nextState = structEq(nextValue, newValue) ? originalValue : nextValue;
      return structEq(nextState, state) ? state : nextState;
    }
  );
}

export function findImpl<T>(predicate: (x: T) => boolean): Prism<T[], T> {
  return choose((xs: T[]) => {
    const i = xs.findIndex(predicate);
    return i < 0 ? Lens.nothing<T[], T>() : Lens.index<T>(i);
  });
}

// augment the base lens module with JSON-specific lens functions.
// @TODO this doesn't look like the best way to do it. we only do it
// for a nice consumer API with all lens function under the same namespace,
// together with the lens type.
declare module './base' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace Lens {
    export let key: typeof keyImpl;

    /**
     * Create a lens that looks at an element at particular index position
     * in an array.
     *
     * @template TItem type of array elements
     * @param i the index
     * @returns a lens to an element at particular position in an array
     */
    export let index: typeof indexImpl;

    /**
     * Create a lens that will show a given default value if the actual
     * value is absent (is undefined).
     *
     * @param defaultValue default value to return
     */
    export let withDefault: typeof withDefaultImpl;

    /**
     * Create a lens that replaces a given value with a new one.
     */
    export let replace: typeof replaceImpl;

    /**
     * Create a prism that focuses on an array's element that
     * satisfies a given predicate.
     */
    export let find: typeof findImpl;
  }
}

Lens.key = keyImpl;
Lens.index = indexImpl;
Lens.withDefault = withDefaultImpl;
Lens.replace = replaceImpl;
Lens.find = findImpl;
