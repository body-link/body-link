import { createModify } from './utils';

export interface Optic<TSource, T, U> {
  get(s: TSource): T;

  set(v: U, s: TSource): TSource;

  modify(updateFn: (v: T) => U, s: TSource): TSource; // tslint:disable-line no-unused-vars

  // @TODO can't optic compose?
}

export namespace Optic {
  export function optic<TSource, T, U>(
    getter: (s: TSource) => T,
    setter: (v: U, s: TSource) => TSource
  ): Optic<TSource, T, U> {
    return {
      get: getter,
      set: setter,
      modify: createModify(getter, setter),
    };
  }
}
