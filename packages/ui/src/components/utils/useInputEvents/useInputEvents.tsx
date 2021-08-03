import React from 'react';
import { isDefined, isNull, TTypify } from '@body-link/type-guards';
import { createUseWatcherDR, KEY_DOWN, KEY_UP } from '@body-link/helpers';
import { fromEvent, merge, Observable } from 'rxjs';
import { filter, map, mergeMap, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { windowWheel$ } from '../events';

// eslint-disable-next-line @rushstack/typedef-var
export const useInputEvents = createUseWatcherDR<TTypify<IInputEvents>>()(
  ({ dependencies$, didMount$, didUnmount$ }) => {
    const ref = React.createRef<HTMLInputElement>();

    didMount$
      .pipe(
        map(() => {
          const el = ref.current;
          if (isNull(el)) {
            throw new Error("Element wasn't found");
          }
          return el;
        }),
        mergeMap((el) => dependencies$.pipe(map((events) => ({ ...events, el })))),
        switchMap(({ el, onFocus, onBlur, onZoom }) => {
          const di: Observable<unknown>[] = [];
          const onFocus$ = fromEvent<FocusEvent>(el, 'focus');
          const onBlur$ = fromEvent<FocusEvent>(el, 'blur');
          if (isDefined(onFocus)) {
            di.push(
              onFocus$.pipe(
                tap((e) => {
                  onFocus(el, e);
                })
              )
            );
          }
          if (isDefined(onBlur)) {
            di.push(
              onBlur$.pipe(
                tap((e) => {
                  onBlur(el, e);
                })
              )
            );
          }
          if (isDefined(onZoom)) {
            const onMouseEnter$ = fromEvent<MouseEvent>(el, 'mouseenter');
            const onMouseLeave$ = fromEvent<MouseEvent>(el, 'mouseleave');
            const onKeyDown$ = fromEvent<KeyboardEvent>(el, 'keydown');
            di.push(
              merge(
                // mouse wheel
                onFocus$.pipe(
                  switchMap(() =>
                    onMouseEnter$.pipe(
                      startWith(0),
                      switchMap(() =>
                        windowWheel$.pipe(
                          tap((e) => {
                            e.preventDefault(); // Prevent zoom-in/out & scroll
                          }),
                          takeUntil(onMouseLeave$)
                        )
                      ),
                      takeUntil(onBlur$)
                    )
                  ),
                  tap((e) => {
                    const up = e.deltaY < 0;
                    onZoom(el, { up, down: !up, altKey: e.altKey, ctrlKey: e.ctrlKey, shiftKey: e.shiftKey });
                  })
                ),
                // keyboard arrows
                onKeyDown$.pipe(
                  filter((e) => {
                    if (e.altKey) {
                      e.preventDefault(); // Prevent focus out on Alt
                    }
                    return e.keyCode === KEY_UP || e.keyCode === KEY_DOWN;
                  }),
                  tap((e) => {
                    const up = e.keyCode === KEY_UP;
                    onZoom(el, { up, down: !up, altKey: e.altKey, ctrlKey: e.ctrlKey, shiftKey: e.shiftKey });
                  })
                )
              )
            );
          }
          return merge(...di);
        }),
        takeUntil(didUnmount$)
      )
      .subscribe();

    return { ref };
  }
);

export interface IInputZoomEvent {
  up: boolean;
  down: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
}

export interface IInputEvents {
  onFocus?: (el: HTMLInputElement, e: FocusEvent) => void;
  onBlur?: (el: HTMLInputElement, e: FocusEvent) => void;
  onZoom?: (el: HTMLInputElement, e: IInputZoomEvent) => void;
}
