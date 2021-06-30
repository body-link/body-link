import {
  isArray,
  isDefined,
  isObject,
  isText,
  TOption,
  TPrimitive,
  TAnyObject,
} from '@body-link/type-guards';

export const isObjectEmpty = <T extends TAnyObject>(obj: T): boolean => Object.keys(obj).length === 0;

export const isArrayEqual = <T>(
  arrA: TOption<T[]>,
  arrB: TOption<T[]>,
  toHash?: (item: T) => TPrimitive
): boolean => {
  if (arrA === arrB) {
    return true;
  }

  if (isArray(arrA) && isArray(arrB) && arrA.length === arrB.length) {
    if (isDefined(toHash)) {
      (arrA as unknown as TPrimitive[]) = (arrA as T[]).map(toHash);
      (arrB as unknown as TPrimitive[]) = (arrB as T[]).map(toHash);
    }
    return arrA.every((item) => arrB.includes(item));
  }

  return false;
};

export const isObjectShallowEqual = <T extends unknown>(objA: T, objB: T): boolean => {
  if (objA === objB) {
    return true;
  }

  if (!isObject(objA) || !isObject(objB)) {
    return false;
  }

  const aKeys = Object.keys(objA);
  const bKeys = Object.keys(objB);
  const len = aKeys.length;

  if (bKeys.length !== len) {
    return false;
  }

  for (let i = 0; i < len; i++) {
    const key = aKeys[i];
    if (objA[key] !== objB[key] || !Object.prototype.hasOwnProperty.call(objB, key)) {
      return false;
    }
  }

  return true;
};

const uuidPattern: RegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const isUUID4 = (id: unknown): boolean => isText(id) && uuidPattern.test(id);
