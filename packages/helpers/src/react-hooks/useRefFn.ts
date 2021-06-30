import { MutableRefObject, useRef } from 'react';

/**
 * One-time ref init.
 * @param init A function that returns a value. Will be called only once.
 * @returns A ref object with the returned value.
 */
export function useRefFn<T>(init: () => T): MutableRefObject<T> {
  const firstRef = useRef(true);
  const ref = useRef<T | null>(null);
  if (firstRef.current) {
    firstRef.current = false;
    ref.current = init();
  }
  return ref as MutableRefObject<T>;
}
