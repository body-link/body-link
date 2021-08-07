import { isNumber, isString } from './primitives';
import { isArray } from './structural';

export const isDefined = <T>(term: T): term is Exclude<T, undefined> => {
  return term !== undefined;
};

// eslint-disable-next-line @rushstack/no-new-null
export const isNotNull = <T>(term: T): term is Exclude<T, null> => {
  return term !== null;
};

// eslint-disable-next-line @rushstack/no-new-null
export const isPresent = <T>(term: T): term is NonNullable<T> => {
  return term !== undefined && term !== null;
};

export const isText = <U>(term: string | U): term is string => {
  return isString(term) && term !== '';
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const isObjectOrNull = <T extends object, U>(term: T | U): term is T => {
  return typeof term === 'object';
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const isNonEmptyArray = <T, U>(term: Array<T> | U): term is Array<T> => {
  return isArray(term) && term.length > 0;
};

export const isNumberOrNan = <U>(term: number | U): term is number => {
  return typeof term === 'number';
};

export const isInteger = <U>(term: number | U): term is number => {
  return isNumber(term) && Number.isInteger(term);
};

export const isFloat = <U>(term: number | U): term is number => {
  return isNumber(term) && !Number.isInteger(term);
};
