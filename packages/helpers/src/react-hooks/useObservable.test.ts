import { BehaviorSubject, NEVER, Observable, of, Subject } from 'rxjs';
import { act, renderHook } from '@testing-library/react-hooks';
import { useObservable } from './useObservable';
import { Atom } from '../packlets/atom';
import { TOption } from '@body-link/type-guards';

const { replaceRaf } = require('raf-stub');

declare const requestAnimationFrame: {
  reset: () => void;
  step: (steps?: number, duration?: number) => void;
};

describe('useObservable', () => {
  beforeAll(() => {
    replaceRaf();
  });

  afterEach(() => {
    requestAnimationFrame.reset();
  });

  it('should start receiving state immediately', () => {
    const spy = jest.fn();
    const $ = of(1, 2, 3);
    const { result } = renderHook(() => {
      const state = useObservable($);
      spy();
      return state;
    });
    expect(result.current).toBe(undefined);
    expect(spy).toHaveBeenCalledTimes(1);

    act(() => {
      requestAnimationFrame.step();
    });
    expect(result.current).toBe(3);
    expect(spy).toHaveBeenCalledTimes(2);

    act(() => {
      requestAnimationFrame.step();
    });
    expect(result.current).toBe(3);
    expect(spy).toHaveBeenCalledTimes(2);

    act(() => {
      requestAnimationFrame.step(400);
    });
    expect(result.current).toBe(3);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should get the init state if given', () => {
    const { result } = renderHook(() => useObservable(NEVER, 1));
    expect(result.current).toBe(1);
  });

  it('should skip the init state if Atom given', () => {
    const $ = Atom.create(43);
    const { result } = renderHook(() => useObservable($, 1));
    expect(result.current).toBe(43);
  });

  it('should skip the init state if ReadOnlyAtom given', () => {
    const $ = Atom.create({ value: 43 }).view('value');
    const { result } = renderHook(() => useObservable($, 1));
    expect(result.current).toBe(43);
  });

  it('should skip the init state if BehaviorSubject given', () => {
    const $ = new BehaviorSubject(43);
    const { result } = renderHook(() => useObservable($, 1));
    expect(result.current).toBe(43);
  });

  it('should update value when Observable emits value', () => {
    const $ = new Subject<number>();
    const { result } = renderHook(() => useObservable($));
    expect(result.current).toBeUndefined();
    act(() => {
      $.next(56);
      requestAnimationFrame.step();
    });
    expect(result.current).toBe(56);
  });

  it('should update value when Observable changes', () => {
    const a$ = Atom.create(43);
    const b$ = of(89);
    const { result, rerender } = renderHook<Observable<number>, TOption<number>>(($) => useObservable($), {
      initialProps: a$,
    });
    expect(result.current).toBe(43);
    rerender(b$);
    act(() => {
      requestAnimationFrame.step();
    });
    expect(result.current).toBe(89);
  });

  it('should skip rerender if Observable receives same value', () => {
    const $ = new Subject<number>();
    const spy = jest.fn();
    const { result } = renderHook(() => {
      const value = useObservable($);
      spy();
      return value;
    });
    expect(result.current).toBeUndefined();
    expect(spy).toHaveBeenCalledTimes(1);
    act(() => {
      $.next(43);
      requestAnimationFrame.step();
    });
    expect(result.current).toBe(43);
    expect(spy).toHaveBeenCalledTimes(2);
    act(() => {
      $.next(43);
      requestAnimationFrame.step();
    });
    expect(result.current).toBe(43);
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
