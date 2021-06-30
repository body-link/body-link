import { useDebugValue, useEffect, useState } from 'react';
import { TOption } from '@body-link/type-guards';
import { BehaviorSubject, Observable } from 'rxjs';
import { Atom, isAnyAtom, ReadOnlyAtom } from '../packlets/atom';

export function useObservable<T>($: BehaviorSubject<T> | Atom<T> | ReadOnlyAtom<T>): T;
export function useObservable<T>($: Observable<T>): TOption<T>;
export function useObservable<T>($: Observable<T>, initialValue: T): T;
export function useObservable<T>($: Observable<T>, initialValue?: T): TOption<T> {
  const [value, setValue] = useState(() => {
    // The conditions order matters
    if (isAnyAtom<T>($)) {
      return $.get();
    } else if ($ instanceof BehaviorSubject) {
      return $.getValue();
    } else {
      return initialValue;
    }
  });

  useEffect(() => {
    let currentValue = initialValue;
    const sub = $.subscribe((nextValue) => {
      if (currentValue !== nextValue) {
        window.requestAnimationFrame(() => {
          // Use callback to safely transfer fn in stream
          setValue(() => nextValue);
          currentValue = nextValue;
        });
      }
    });
    return () => sub.unsubscribe();
  }, [$]);

  // Display state in React DevTools
  useDebugValue(value);

  return value;
}
