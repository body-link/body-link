import { TAnyObject } from '@body-link/type-guards';
import { Observable, ReplaySubject } from 'rxjs';
import { useEffect } from 'react';
import { useRefFn } from './useRefFn';

/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const createUseWatcherR =
  () =>
  <
    TCreate extends (context: {
      didMount$: Observable<boolean>;
      didUnmount$: Observable<boolean>;
    }) => TAnyObject | void
  >(
    create: TCreate
  ): (() => ReturnType<TCreate>) => {
    return () => {
      const {
        current: [mDidMount$, mDidUnmount$, mReturn],
      } = useRefFn(() => {
        const didMount$ = new ReplaySubject<boolean>(1);
        const didUnmount$ = new ReplaySubject<boolean>(1);
        return [
          didMount$,
          didUnmount$,
          create({ didMount$, didUnmount$ }),
        ];
      });

      useEffect(() => {
        mDidMount$.next(true);
        return () => {
          mDidUnmount$.next(true);
          mDidUnmount$.complete();
          mDidMount$.complete();
        };
      }, []);

      return mReturn as ReturnType<TCreate>;
    };
  };
