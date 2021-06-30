import { renderHook, act } from '@testing-library/react-hooks';
import { TAnyObject } from '@body-link/type-guards';
import { takeUntil } from 'rxjs/operators';
import { createUseWatcherDSR } from './createUseWatcherDSR';

const { replaceRaf } = require('raf-stub');

declare const requestAnimationFrame: {
  reset: () => void;
  step: (steps?: number, duration?: number) => void;
};

describe('createUseWatcherDSR', () => {
  beforeAll(() => {
    replaceRaf();
  });

  afterEach(() => {
    requestAnimationFrame.reset();
  });

  it('should call the init function once', () => {
    const createSpy = jest.fn(() => ({}));
    const useWatcher = createUseWatcherDSR({})(createSpy);
    const { rerender } = renderHook(() => useWatcher({}));
    expect(createSpy).toBeCalledTimes(1);
    rerender();
    expect(createSpy).toBeCalledTimes(1);
    rerender();
    expect(createSpy).toBeCalledTimes(1);
  });

  it('should start receiving state immediately', () => {
    const spy = jest.fn();
    const useWatcher = createUseWatcherDSR({ value: 1 })(() => {
      return { foo: 'bar' };
    });
    const { result } = renderHook(() => {
      const state = useWatcher({});
      spy();
      return state;
    });
    expect(result.current.foo).toBe('bar');
    expect(result.current.state.value).toBe(1);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should update state on action', () => {
    const spy = jest.fn();
    const useWatcher = createUseWatcherDSR({ value: 1 })(({ state$ }) => {
      return { action: () => state$.modify((prev) => ({ value: prev.value + 1 })) };
    });
    const { result } = renderHook(() => {
      const state = useWatcher({});
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
    const useWatcher = createUseWatcherDSR({})(({ didMount$ }) => {
      didMount$.subscribe(spy);
    });
    const hook = renderHook(() => {
      useWatcher({});
    });
    expect(spy).toHaveBeenCalledTimes(1);
    hook.rerender();
    expect(spy).toHaveBeenCalledTimes(1);
    hook.unmount();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should handle didUnmount$', () => {
    const spy = jest.fn();
    const useWatcher = createUseWatcherDSR({})(({ didUnmount$ }) => {
      didUnmount$.subscribe(spy);
    });
    const hook = renderHook(() => {
      useWatcher({});
    });
    expect(spy).toHaveBeenCalledTimes(0);
    hook.rerender();
    expect(spy).toHaveBeenCalledTimes(0);
    hook.unmount();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should handle dependencies$', () => {
    const spy = jest.fn();
    const useWatcher = createUseWatcherDSR<{ one: number }, TAnyObject>({})(
      ({ dependencies$, didUnmount$ }) => {
        dependencies$.pipe(takeUntil(didUnmount$)).subscribe(({ one }) => spy(one));
      }
    );
    const { result, rerender } = renderHook(
      (props: { one: number }) => {
        useWatcher(props);
        return props.one;
      },
      { initialProps: { one: 1 } }
    );
    expect(result.current).toBe(1);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenLastCalledWith(result.current);
    rerender({ one: 2 });
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenLastCalledWith(result.current);
    // same data structure shouldn't trigger update
    rerender({ one: 2 });
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenLastCalledWith(result.current);
  });

  it('should independently use watcher in different components', () => {
    const spyDidMount = jest.fn();
    const spyDidUnmount = jest.fn();
    const spyState = jest.fn();
    const spyDependencies = jest.fn();
    const useWatcher = createUseWatcherDSR<{ one: number }, { value: number }>({ value: 1 })(
      ({ state$, dependencies$, didMount$, didUnmount$ }) => {
        didMount$.subscribe(spyDidMount);
        didUnmount$.subscribe(spyDidUnmount);
        state$.pipe(takeUntil(didUnmount$)).subscribe(({ value }) => spyState(value));
        dependencies$.pipe(takeUntil(didUnmount$)).subscribe(({ one }) => spyDependencies(one));
        return {
          change: (nextValue: number) => state$.lens('value').set(nextValue),
          random: Math.random(),
        };
      }
    );
    const hookA = renderHook((props: { one: number }) => useWatcher(props), { initialProps: { one: 7 } });
    const hookB = renderHook((props: { one: number }) => useWatcher(props), { initialProps: { one: 9 } });

    expect(spyDidMount).toHaveBeenCalledTimes(2);
    expect(spyDidUnmount).toHaveBeenCalledTimes(0);
    expect(spyState).toHaveBeenCalledTimes(2);
    expect(spyState).toHaveBeenNthCalledWith(1, 1);
    expect(spyState).toHaveBeenNthCalledWith(2, 1);
    expect(spyDependencies).toHaveBeenCalledTimes(2);
    expect(spyDependencies).toHaveBeenNthCalledWith(1, 7);
    expect(spyDependencies).toHaveBeenNthCalledWith(2, 9);
    expect(hookA.result.current !== hookB.result.current).toBeTruthy();

    hookA.rerender({ one: 45 });
    expect(spyDidMount).toHaveBeenCalledTimes(2);
    expect(spyDidUnmount).toHaveBeenCalledTimes(0);
    expect(spyState).toHaveBeenCalledTimes(2);
    expect(spyDependencies).toHaveBeenCalledTimes(3);
    expect(spyDependencies).toHaveBeenLastCalledWith(45);

    hookB.rerender({ one: 54 });
    expect(spyDidMount).toHaveBeenCalledTimes(2);
    expect(spyDidUnmount).toHaveBeenCalledTimes(0);
    expect(spyState).toHaveBeenCalledTimes(2);
    expect(spyDependencies).toHaveBeenCalledTimes(4);
    expect(spyDependencies).toHaveBeenLastCalledWith(54);

    act(() => {
      hookA.result.current.change(387);
      requestAnimationFrame.step();
    });
    expect(spyDidMount).toHaveBeenCalledTimes(2);
    expect(spyDidUnmount).toHaveBeenCalledTimes(0);
    expect(spyState).toHaveBeenCalledTimes(3);
    expect(spyState).toHaveBeenLastCalledWith(387);
    expect(spyDependencies).toHaveBeenCalledTimes(4);
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
    expect(spyDependencies).toHaveBeenCalledTimes(4);
    expect(hookA.result.current.state.value).toBe(387);
    expect(hookB.result.current.state.value).toBe(906);

    hookA.unmount();
    expect(spyDidMount).toHaveBeenCalledTimes(2);
    expect(spyDidUnmount).toHaveBeenCalledTimes(1);
    expect(spyState).toHaveBeenCalledTimes(4);
    expect(spyDependencies).toHaveBeenCalledTimes(4);

    hookB.unmount();
    expect(spyDidMount).toHaveBeenCalledTimes(2);
    expect(spyDidUnmount).toHaveBeenCalledTimes(2);
    expect(spyState).toHaveBeenCalledTimes(4);
    expect(spyDependencies).toHaveBeenCalledTimes(4);
  });
});
