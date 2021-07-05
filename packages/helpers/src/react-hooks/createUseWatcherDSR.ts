import { TAnyObject } from '@body-link/type-guards';
import { Observable, ReplaySubject } from 'rxjs';
import { useDebugValue, useEffect, useState } from 'react';
import { Atom, ReadOnlyAtom } from '../packlets/atom';
import { useRefFn } from './useRefFn';

/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const createUseWatcherDSR =
  <TDeps extends TAnyObject, TState extends TAnyObject>(initialState: TState) =>
  <
    TCreate extends (context: {
      dependencies$: ReadOnlyAtom<TDeps>;
      state$: Atom<TState>;
      didMount$: Observable<boolean>;
      didUnmount$: Observable<boolean>;
    }) => TAnyObject | void
  >(
    create: TCreate
  ): ((
    deps: TDeps
  ) => ReturnType<TCreate> extends void ? { state: TState } : ReturnType<TCreate> & { state: TState }) => {
    return (dependencies) => {
      const [state, setState] = useState(initialState);

      const {
        current: [mDidMount$, mDidUnmount$, mState$, mReturn, updateDeps],
      } = useRefFn(() => {
        const state$ = Atom.create(initialState);
        const dependencies$ = Atom.create(dependencies);
        const didMount$ = new ReplaySubject<boolean>(1);
        const didUnmount$ = new ReplaySubject<boolean>(1);
        return [
          didMount$,
          didUnmount$,
          state$,
          create({ didMount$, didUnmount$, dependencies$, state$ }),
          (d: TDeps) => dependencies$.set(d),
        ];
      });

      useEffect(() => {
        mDidMount$.next(true);
        let currentState = initialState;
        const sub = mState$.subscribe((nextState) => {
          if (currentState !== nextState) {
            // Use callback to safely transfer fn in stream
            setState(() => nextState);
            currentState = nextState;
          }
        });
        return () => {
          sub.unsubscribe();
          mDidUnmount$.next(true);
          mDidUnmount$.complete();
          mDidMount$.complete();
        };
      }, []);

      updateDeps(dependencies);

      // Display state in React DevTools
      useDebugValue(state);

      return {
        state,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(mReturn as any),
      };
    };
  };
