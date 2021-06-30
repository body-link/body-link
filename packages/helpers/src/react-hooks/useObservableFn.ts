import { TOption } from '@body-link/type-guards';
import { BehaviorSubject, Observable } from 'rxjs';
import { Atom, ReadOnlyAtom } from '../packlets/atom';
import { useObservable } from './useObservable';
import { useRefFn } from './useRefFn';

export function useObservableFn<T>(fn: () => BehaviorSubject<T> | Atom<T> | ReadOnlyAtom<T>): T;
export function useObservableFn<T>(fn: () => Observable<T>): TOption<T>;
export function useObservableFn<T>(fn: () => Observable<T>, defaultValue: T): T;
export function useObservableFn<T>(fn: () => Observable<T>, defaultValue?: T): TOption<T> {
  return useObservable(useRefFn(fn).current, defaultValue);
}
