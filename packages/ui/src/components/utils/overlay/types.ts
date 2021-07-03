import React from 'react';
import { Placement } from '@popperjs/core';

export interface IOverlayStaticOptions {
  closeOnEsc: boolean;
  closeOnScroll: boolean;
  closeOnOutsideClick: boolean;
  closeOnInnerClick: boolean;
}

export interface IOverlayStaticPayload<Options> {
  element: React.ReactElement;
  options?: Partial<Options>;
}

export interface IOverlayOptions extends IOverlayStaticOptions {
  placement: Placement;
  offset: [number, number] | null;
  hasArrow: boolean;
}

export interface IOverlayPayload extends IOverlayStaticPayload<IOverlayOptions> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refDock: React.RefObject<any>;
}
