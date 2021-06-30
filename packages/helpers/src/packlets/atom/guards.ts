import { Atom, ReadOnlyAtom } from './types';
import { ImplAtom } from './ImplAtom';
import { ImplReadOnlyAtom } from './ImplReadOnlyAtom';

export const isAtom = <T>(value: unknown): value is Atom<T> => {
  return value instanceof ImplAtom;
};

export const isReadOnlyAtom = <T>(value: unknown): value is ReadOnlyAtom<T> => {
  return value instanceof ImplReadOnlyAtom;
};

export const isAnyAtom = <T>(value: unknown): value is Atom<T> | ReadOnlyAtom<T> => {
  return isAtom(value) || isReadOnlyAtom(value);
};
