import React from 'react';
import ReactDOM from 'react-dom';
import { merge, Subscription } from 'rxjs';
import { filter, skip, switchMap, take } from 'rxjs/operators';
import { isDefined, isNull, TNoop } from '@body-link/type-guards';
import { Atom, cs, ReadOnlyAtom, removeUndefined, Signal } from '@body-link/helpers';
import { documentClick$, escPress$, windowWheel$ } from '../events';
import { IOverlayStaticOptions, IOverlayStaticPayload } from './types';

export class OverlayStatic<T1 extends IOverlayStaticOptions, T2 extends IOverlayStaticPayload<T1>> {
  public options: T1;
  public readonly isOpen$: ReadOnlyAtom<boolean>;
  public get isOpen(): boolean {
    return this.isOpen$.get();
  }
  public get isAttached(): boolean {
    return document.body.contains(this._wrapper);
  }
  public readonly refContainer: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();

  public open: Signal<T2> = cs<T2>();

  public close: Signal = cs((emit, payload) => {
    this.unmount();
    emit(payload);
  });

  private _sub: Subscription;
  private _isOpen$: Atom<boolean> = Atom.create<boolean>(false);
  private _wrapper: HTMLDivElement = document.createElement('div');

  public constructor(options: T1) {
    this.options = options;
    this.isOpen$ = this._isOpen$.view();
    this._sub = this.open.$.pipe(
      switchMap((payload) => {
        if (isDefined(payload.options)) {
          this.options = { ...this.options, ...removeUndefined(payload.options) };
        }
        const {
          refContainer,
          options: { closeOnEsc, closeOnScroll, closeOnInnerClick, closeOnOutsideClick },
        } = this;

        if (!this.isAttached) {
          window.requestAnimationFrame(() => {
            this._isOpen$.set(true);
          });
        }
        // Each open brings overlay to the top position in DOM tree
        document.body.appendChild(this._wrapper);
        this.render(payload);

        return merge(
          ...[
            closeOnScroll
              ? windowWheel$.pipe(
                  filter((e) => {
                    const target = e.target as Element;
                    return isNull(refContainer.current) || !refContainer.current.contains(target);
                  })
                )
              : undefined,
            closeOnEsc ? escPress$ : undefined,
            closeOnInnerClick || closeOnOutsideClick
              ? documentClick$.pipe(
                  skip(1),
                  filter((e) => {
                    const target = e.target as Element;
                    if (isNull(refContainer.current)) {
                      return true;
                    }
                    if (refContainer.current.contains(target)) {
                      return closeOnInnerClick;
                    } else {
                      return closeOnOutsideClick;
                    }
                  })
                )
              : undefined,
          ].filter(isDefined)
        ).pipe(take(1));
      })
    ).subscribe(this.close);
  }

  public destroy = (): void => {
    this._sub.unsubscribe();
    this.close();
  };

  protected render(payload: T2, callback?: TNoop): void {
    ReactDOM.render(payload.element, this._wrapper, () => {
      // this.wrapper.childNodes.forEach((el) => {
      //   (el as HTMLDivElement).style.zIndex = Z_INDEX_BASE.toString();
      // });
      if (isDefined(callback)) {
        callback();
      }
    });
  }

  protected unmount(): void {
    if (this.isAttached) {
      ReactDOM.unmountComponentAtNode(this._wrapper);
      document.body.removeChild(this._wrapper);
      this._isOpen$.set(false);
      this._wrapper = document.createElement('div');
    }
  }
}
