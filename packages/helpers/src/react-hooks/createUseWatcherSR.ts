import { TAnyObject } from '@body-link/type-guards';
import { Observable, ReplaySubject } from 'rxjs';
import { useDebugValue, useEffect, useState } from 'react';
import { Atom } from '../packlets/atom';
import { useRefFn } from './useRefFn';

/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const createUseWatcherSR =
  <TState extends TAnyObject>(initialState: TState) =>
  <
    TCreate extends (context: {
      state$: Atom<TState>;
      didMount$: Observable<boolean>;
      didUnmount$: Observable<boolean>;
    }) => TAnyObject | void
  >(
    create: TCreate
  ): (() => ReturnType<TCreate> extends void
    ? { state: TState }
    : ReturnType<TCreate> & { state: TState }) => {
    return () => {
      const [state, setState] = useState(initialState);

      const {
        current: [mDidMount$, mDidUnmount$, mState$, mReturn],
      } = useRefFn(() => {
        const state$ = Atom.create(initialState);
        const didMount$ = new ReplaySubject<boolean>(1);
        const didUnmount$ = new ReplaySubject<boolean>(1);
        return [didMount$, didUnmount$, state$, create({ didMount$, didUnmount$, state$ })];
      });

      useEffect(() => {
        mDidMount$.next(true);
        let currentState = initialState;
        const sub = mState$.subscribe((nextState) => {
          if (currentState !== nextState) {
            window.requestAnimationFrame(() => {
              setState(() => nextState);
              currentState = nextState;
            });
          }
        });
        return () => {
          sub.unsubscribe();
          mDidUnmount$.next(true);
          mDidUnmount$.complete();
          mDidMount$.complete();
        };
      }, []);

      // Display state in React DevTools
      useDebugValue(state);

      return {
        state,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(mReturn as any),
      };
    };
  };
