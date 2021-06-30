import { useMemo } from 'react';
import { TOption } from '@body-link/type-guards';
import { BehaviorSubject, Observable } from 'rxjs';
import { Atom, ReadOnlyAtom } from '../packlets/atom';
import { useObservable } from './useObservable';

export function useObservableMemo<T>(
  create: () => BehaviorSubject<T> | Atom<T> | ReadOnlyAtom<T>,
  deps: unknown[]
): T;
export function useObservableMemo<T>(create: () => Observable<T>, deps: unknown[]): TOption<T>;
export function useObservableMemo<T>(create: () => Observable<T>, deps: unknown[], defaultValue: T): T;
export function useObservableMemo<T>(
  create: () => Observable<T>,
  deps: unknown[],
  defaultValue?: T
): TOption<T> {
  return useObservable(useMemo(create, deps), defaultValue);
}
