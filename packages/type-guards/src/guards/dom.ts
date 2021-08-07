export function isHTMLElement(value: unknown): value is HTMLElement {
  return value instanceof HTMLElement;
}

export function isSVGElement(value: unknown): value is SVGElement {
  return value instanceof SVGElement;
}

export function isMouseEvent(value: unknown): value is MouseEvent {
  return value instanceof MouseEvent;
}
