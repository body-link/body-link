import { default as structEq } from 'fast-deep-equal/es6';

export { default as structEq } from 'fast-deep-equal/es6';

export function setKey<T, K extends keyof T>(k: K, v: T[K], o: T): T {
  if (k in o && structEq(v, o[k])) {
    return o;
  } else {
    // this is the fastest way to do it, see
    // https://jsperf.com/focal-setkey-for-loop-vs-object-assign
    const r: { [k in keyof T]: T[k] } = {} as never;
    // eslint-disable-next-line guard-for-in
    for (const p in o) {
      r[p] = o[p];
    }
    r[k] = v;
    return r;
  }
}

export function createModify<TSource, T, U>(
  getter: (s: TSource) => T,
  setter: (v: U, s: TSource) => TSource
): (updateFn: (v: T) => U, s: TSource) => TSource {
  return function modify(updateFn: (v: T) => U, s: TSource) {
    return setter(updateFn(getter(s)), s);
  };
}
