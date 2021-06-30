import { act, renderHook } from '@testing-library/react-hooks';
import { takeUntil } from 'rxjs/operators';
import { createUseWatcherSR } from './createUseWatcherSR';

const { replaceRaf } = require('raf-stub');

declare const requestAnimationFrame: {
  reset: () => void;
  step: (steps?: number, duration?: number) => void;
};

describe('createUseWatcherSR', () => {
  beforeAll(() => {
    replaceRaf();
  });

  afterEach(() => {
    requestAnimationFrame.reset();
  });

  it('should call the init function once', () => {
    const createSpy = jest.fn(() => ({}));
    const useWatcher = createUseWatcherSR({})(createSpy);
    const { rerender } = renderHook(() => useWatcher());
    expect(createSpy).toBeCalledTimes(1);
    rerender();
    expect(createSpy).toBeCalledTimes(1);
    rerender();
    expect(createSpy).toBeCalledTimes(1);
  });

  it('should start receiving state immediately', () => {
    const spy = jest.fn();
    const useWatcher = createUseWatcherSR({ value: 1 })(() => {
      return { foo: 'bar' };
    });
    const { result } = renderHook(() => {
      const state = useWatcher();
      spy();
      return state;
    });
    expect(result.current.foo).toBe('bar');
    expect(result.current.state.value).toBe(1);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should update state on action', () => {
    const spy = jest.fn();
    const useWatcher = createUseWatcherSR({ value: 1 })(({ state$ }) => {
      return { action: () => state$.modify((prev) => ({ value: prev.value + 1 })) };
    });
    const { result } = renderHook(() => {
      const state = useWatcher();
      spy();
      return state;
    });
    expect(result.current.state.value).toBe(1);
    expect(spy).toHaveBeenCalledTimes(1);
    act(() => {
      result.current.action();
      requestAnimationFrame.step();
    });
    expect(result.current.state.value).toBe(2);
    expect(spy).toHaveBeenCalledTimes(2);
    act(() => {
      result.current.action();
      requestAnimationFrame.step();
    });
    expect(result.current.state.value).toBe(3);
    expect(spy).toHaveBeenCalledTimes(3);
  });

  it('should handle didMount$', () => {
    const spy = jest.fn();
    const useWatcher = createUseWatcherSR({})(({ didMount$ }) => {
      didMount$.subscribe(spy);
    });
    const hook = renderHook(() => {
      useWatcher();
    });
    expect(spy).toHaveBeenCalledTimes(1);
    hook.rerender();
    expect(spy).toHaveBeenCalledTimes(1);
    hook.unmount();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should handle didUnmount$', () => {
    const spy = jest.fn();
    const useWatcher = createUseWatcherSR({})(({ didUnmount$ }) => {
      didUnmount$.subscribe(spy);
    });
    const hook = renderHook(() => {
      useWatcher();
    });
    expect(spy).toHaveBeenCalledTimes(0);
    hook.rerender();
    expect(spy).toHaveBeenCalledTimes(0);
    hook.unmount();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should independently use watcher in different components', () => {
    const spyDidMount = jest.fn();
    const spyDidUnmount = jest.fn();
    const spyState = jest.fn();
    const useWatcher = createUseWatcherSR<{ value: number }>({ value: 1 })(
      ({ state$, didMount$, didUnmount$ }) => {
        didMount$.subscribe(spyDidMount);
        didUnmount$.subscribe(spyDidUnmount);
        state$.pipe(takeUntil(didUnmount$)).subscribe(({ value }) => spyState(value));
        return {
          change: (nextValue: number) => state$.lens('value').set(nextValue),
          random: Math.random(),
        };
      }
    );
    const hookA = renderHook(() => useWatcher());
    const hookB = renderHook(() => useWatcher());

    expect(spyDidMount).toHaveBeenCalledTimes(2);
    expect(spyDidUnmount).toHaveBeenCalledTimes(0);
    expect(spyState).toHaveBeenCalledTimes(2);
    expect(spyState).toHaveBeenNthCalledWith(1, 1);
    expect(spyState).toHaveBeenNthCalledWith(2, 1);
    expect(hookA.result.current !== hookB.result.current).toBeTruthy();

    hookA.rerender();
    expect(spyDidMount).toHaveBeenCalledTimes(2);
    expect(spyDidUnmount).toHaveBeenCalledTimes(0);
    expect(spyState).toHaveBeenCalledTimes(2);

    hookB.rerender();
    expect(spyDidMount).toHaveBeenCalledTimes(2);
    expect(spyDidUnmount).toHaveBeenCalledTimes(0);
    expect(spyState).toHaveBeenCalledTimes(2);

    act(() => {
      hookA.result.current.change(387);
      requestAnimationFrame.step();
    });
    expect(spyDidMount).toHaveBeenCalledTimes(2);
    expect(spyDidUnmount).toHaveBeenCalledTimes(0);
    expect(spyState).toHaveBeenCalledTimes(3);
    expect(spyState).toHaveBeenLastCalledWith(387);
    expect(hookA.result.current.state.value).toBe(387);
    expect(hookB.result.current.state.value).toBe(1);

    act(() => {
      hookB.result.current.change(906);
      requestAnimationFrame.step();
    });
    expect(spyDidMount).toHaveBeenCalledTimes(2);
    expect(spyDidUnmount).toHaveBeenCalledTimes(0);
    expect(spyState).toHaveBeenCalledTimes(4);
    expect(spyState).toHaveBeenLastCalledWith(906);
    expect(hookA.result.current.state.value).toBe(387);
    expect(hookB.result.current.state.value).toBe(906);

    hookA.unmount();
    expect(spyDidMount).toHaveBeenCalledTimes(2);
    expect(spyDidUnmount).toHaveBeenCalledTimes(1);
    expect(spyState).toHaveBeenCalledTimes(4);

    hookB.unmount();
    expect(spyDidMount).toHaveBeenCalledTimes(2);
    expect(spyDidUnmount).toHaveBeenCalledTimes(2);
    expect(spyState).toHaveBeenCalledTimes(4);
  });
});
