import { Observable } from 'rxjs';
import { isFunction, isUndefined } from '@body-link/type-guards';
import { Atom, ReadOnlyAtom } from './types';

export const isAnyAtom = <T>(value: unknown): value is Atom<T> | ReadOnlyAtom<T> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return value instanceof Observable && isFunction((value as any).view);
};

export const isAtom = <T>(value: unknown): value is Atom<T> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return isAnyAtom(value) && isFunction((value as any).set);
};

export const isReadOnlyAtom = <T>(value: unknown): value is ReadOnlyAtom<T> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return isAnyAtom(value) && isUndefined((value as any).set);
};
