import { MutableRefObject, Ref, RefCallback, useMemo } from 'react';
import { isFunction, isPresent, TOption } from '@body-link/type-guards';

/**
 * Credit to material-ui for this snippet
 */

// eslint-disable-next-line @rushstack/no-new-null
export type HTMLElementOrNull = HTMLElement | null;
export type AnyRef = TOption<Ref<HTMLElement>>;

function setRef(ref: AnyRef, value: HTMLElementOrNull): void {
  if (isFunction(ref)) {
    ref(value);
  } else if (isPresent(ref)) {
    (ref as MutableRefObject<HTMLElementOrNull>).current = value;
  }
}

/**
 * useForkRef
 * Joins refs together and returns a combination of the two as a new ref
 *
 * @param refA
 * @param refB
 */
// eslint-disable-next-line @rushstack/no-new-null
export function useForkRef(refA: AnyRef, refB: AnyRef): RefCallback<HTMLElement> | null {
  /**
   * This will create a new function if the ref props change and are defined.
   * This means react will call the old forkRef with `null` and the new forkRef
   * with the ref. Cleanup naturally emerges from this behavior
   */
  return useMemo(
    () =>
      isPresent(refA) || isPresent(refB)
        ? (refValue: HTMLElementOrNull) => {
            setRef(refA, refValue);
            setRef(refB, refValue);
          }
        : null,
    [refA, refB]
  );
}
