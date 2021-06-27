import { TMaybe, TObjectCheck } from './types';

export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}

export function isDefined<T>(value: T): value is Exclude<T, undefined> {
  return value !== undefined;
}

// eslint-disable-next-line @rushstack/no-new-null
export function isNull(value: unknown): value is null {
  return value === null;
}

// eslint-disable-next-line @rushstack/no-new-null
export function isNotNull<T>(value: T): value is Exclude<T, null> {
  return value !== null;
}

export function isPresent<T>(value: T): value is NonNullable<T> {
  return value !== undefined && value !== null;
}

export function isError(value: unknown): value is Error {
  const tag = toString.call(value);
  switch (tag) {
    case '[object Error]':
      return true;
    case '[object Exception]':
      return true;
    case '[object DOMException]':
      return true;
    default:
      return value instanceof Error;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isArray<T>(value: T): value is Extract<T, any[] | ReadonlyArray<any>> {
  return Array.isArray(value) || value instanceof Array;
}

// http://jsperf.com/isobject4
// eslint-disable-next-line @typescript-eslint/ban-types
export function isObject<T extends TMaybe<{}>>(value: T): value is TObjectCheck<NonNullable<T>> {
  return value !== null && typeof value === 'object';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value);
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isText(value: unknown): value is string {
  return isString(value) && value !== '';
}

export function isHTMLElement(value: unknown): value is HTMLElement {
  return value instanceof HTMLElement;
}

export function isSVGElement(value: unknown): value is SVGElement {
  return value instanceof SVGElement;
}

export function isMouseEvent(value: unknown): value is MouseEvent {
  return value instanceof MouseEvent;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}
