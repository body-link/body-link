import { isDefined, isObject, TIdentifier, TOption, TAnyObject } from '@body-link/type-guards';
import { augmentedJSONParse } from './augmentedJSONParse';

export const arrayToRecord = <T1, T2 extends TIdentifier = string>(
  arr: T1[],
  getKeyName?: (item: T1) => T2
): Record<T2, T1> => {
  const hasKeyNameGetter = isDefined(getKeyName);
  return arr.reduce((acc, item) => {
    acc[hasKeyNameGetter ? (getKeyName as (item: T1) => T2)(item) : (item as unknown as T2)] = item;
    return acc;
  }, {} as Record<T2, T1>);
};

export const stringToObject = <T extends TAnyObject>(str: string, isAugmented = false): TOption<T> => {
  try {
    const obj = isAugmented ? augmentedJSONParse(str) : JSON.parse(str);
    return isObject(obj) ? obj : undefined;
  } catch (_) {
    return undefined;
  }
};

export const stringToHashNumber = (str: string): number =>
  // eslint-disable-next-line no-bitwise
  Math.abs(Array.from(str).reduce((s, c) => (Math.imul(31, s) + c.charCodeAt(0)) | 0, 0));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const removeUndefined = <T extends Record<string, any>>(v: T, recursive = false): T => {
  return Object.entries(v).reduce<T>((acc, [key, val]) => {
    if (isDefined(val)) {
      acc[key as keyof T] = recursive && isObject(val) ? removeUndefined(val) : val;
    }
    return acc;
  }, {} as T);
};
