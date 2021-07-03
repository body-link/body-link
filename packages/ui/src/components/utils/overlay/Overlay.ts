import React from 'react';
import { cs, Signal } from '@body-link/helpers';
import { isDefined, TOption } from '@body-link/type-guards';
import { createPopper, Instance, Modifier, OptionsGeneric } from '@popperjs/core';
import { OverlayStatic } from './OverlayStatic';
import { IOverlayOptions, IOverlayPayload } from './types';

export class Overlay extends OverlayStatic<IOverlayOptions, IOverlayPayload> {
  public readonly refArrow: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();

  public close: Signal = cs((emit, payload) => {
    if (isDefined(this._popper)) {
      this._popper.destroy();
      delete this._popper;
    }
    this.unmount();
    emit(payload);
  });

  private _popper: TOption<Instance>;

  public update = (): void => {
    if (isDefined(this._popper)) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this._popper.update();
    }
  };

  protected render(payload: IOverlayPayload): void {
    super.render(payload, () => {
      if (this.isAttached) {
        const options = this._getPopperOptions();
        const nextDockEl = payload.refDock.current;
        const currentDockEl = this._popper?.state.elements.reference;
        if (isDefined(this._popper)) {
          if (nextDockEl === currentDockEl) {
            return this._popper.setOptions(options);
          } else {
            this._popper.destroy();
          }
        }
        this._popper = createPopper(nextDockEl, this.refContainer.current!, options);
      }
    });
  }

  private _getPopperOptions(): Partial<OptionsGeneric<Partial<Modifier<unknown, unknown>>>> {
    const modifiers: Partial<Modifier<unknown, unknown>>[] = [];
    if (this.options.offset !== 0) {
      modifiers.push({
        name: 'offset',
        options: {
          offset: this.options.offset,
        },
      });
    }
    if (this.options.hasArrow) {
      modifiers.push({ name: 'arrow', options: { element: this.refArrow.current } });
    }
    return { placement: this.options.placement, modifiers };
  }
}
