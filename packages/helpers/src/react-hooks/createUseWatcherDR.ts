import { TAnyObject } from '@body-link/type-guards';
import { Observable, ReplaySubject } from 'rxjs';
import { useEffect } from 'react';
import { Atom, ReadOnlyAtom } from '../packlets/atom';
import { useRefFn } from './useRefFn';

/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const createUseWatcherDR =
  <TDeps extends TAnyObject>() =>
  <
    TCreate extends (context: {
      dependencies$: ReadOnlyAtom<TDeps>;
      didMount$: Observable<boolean>;
      didUnmount$: Observable<boolean>;
    }) => TAnyObject | void
  >(
    create: TCreate
  ): ((deps: TDeps) => ReturnType<TCreate>) => {
    return (dependencies) => {
      const {
        current: [mDidMount$, mDidUnmount$, mReturn, updateDeps],
      } = useRefFn(() => {
        const dependencies$ = Atom.create(dependencies);
        const didMount$ = new ReplaySubject<boolean>(1);
        const didUnmount$ = new ReplaySubject<boolean>(1);
        return [
          didMount$,
          didUnmount$,
          create({ didMount$, didUnmount$, dependencies$ }),
          (d: TDeps) => dependencies$.set(d),
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

      updateDeps(dependencies);

      return mReturn as ReturnType<TCreate>;
    };
  };
