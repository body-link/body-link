import { renderHook } from '@testing-library/react-hooks';
import { takeUntil } from 'rxjs/operators';
import { createUseWatcherDR } from './createUseWatcherDR';

const { replaceRaf } = require('raf-stub');

declare const requestAnimationFrame: {
  reset: () => void;
  step: (steps?: number, duration?: number) => void;
};

describe('createUseWatcherDR', () => {
  beforeAll(() => {
    replaceRaf();
  });

  afterEach(() => {
    requestAnimationFrame.reset();
  });

  it('should call the init function once', () => {
    const createSpy = jest.fn(() => ({}));
    const useWatcher = createUseWatcherDR()(createSpy);
    const { rerender } = renderHook(() => useWatcher({}));
    expect(createSpy).toBeCalledTimes(1);
    rerender();
    expect(createSpy).toBeCalledTimes(1);
    rerender();
    expect(createSpy).toBeCalledTimes(1);
  });

  it('should start receiving state immediately', () => {
    const spy = jest.fn();
    const useWatcher = createUseWatcherDR()(() => {
      return { foo: 'bar' };
    });
    const { result } = renderHook(() => {
      const state = useWatcher({});
      spy();
      return state;
    });
    expect(result.current.foo).toBe('bar');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should handle didMount$', () => {
    const spy = jest.fn();
    const useWatcher = createUseWatcherDR()(({ didMount$ }) => {
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
    const useWatcher = createUseWatcherDR()(({ didUnmount$ }) => {
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
    const useWatcher = createUseWatcherDR<{ one: number }>()(({ dependencies$, didUnmount$ }) => {
      dependencies$.pipe(takeUntil(didUnmount$)).subscribe(({ one }) => spy(one));
    });
    const { result, rerender } = renderHook(
      (props: { one: number }) => {
        useWatcher(props);
        return props.one;
      },
      { initialProps: { one: 89 } }
    );
    expect(result.current).toBe(89);
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
    const spyDependencies = jest.fn();
    const useWatcher = createUseWatcherDR<{ one: number }>()(({ dependencies$, didMount$, didUnmount$ }) => {
      didMount$.subscribe(spyDidMount);
      didUnmount$.subscribe(spyDidUnmount);
      dependencies$.pipe(takeUntil(didUnmount$)).subscribe(({ one }) => spyDependencies(one));
      return {
        random: Math.random(),
      };
    });
    const hookA = renderHook((props: { one: number }) => useWatcher(props), { initialProps: { one: 7 } });
    const hookB = renderHook((props: { one: number }) => useWatcher(props), { initialProps: { one: 9 } });

    expect(spyDidMount).toHaveBeenCalledTimes(2);
    expect(spyDidUnmount).toHaveBeenCalledTimes(0);
    expect(spyDependencies).toHaveBeenCalledTimes(2);
    expect(spyDependencies).toHaveBeenNthCalledWith(1, 7);
    expect(spyDependencies).toHaveBeenNthCalledWith(2, 9);
    expect(hookA.result.current !== hookB.result.current).toBeTruthy();

    hookA.rerender({ one: 45 });
    expect(spyDidMount).toHaveBeenCalledTimes(2);
    expect(spyDidUnmount).toHaveBeenCalledTimes(0);
    expect(spyDependencies).toHaveBeenCalledTimes(3);
    expect(spyDependencies).toHaveBeenLastCalledWith(45);

    hookB.rerender({ one: 54 });
    expect(spyDidMount).toHaveBeenCalledTimes(2);
    expect(spyDidUnmount).toHaveBeenCalledTimes(0);
    expect(spyDependencies).toHaveBeenCalledTimes(4);
    expect(spyDependencies).toHaveBeenLastCalledWith(54);

    hookA.unmount();
    expect(spyDidMount).toHaveBeenCalledTimes(2);
    expect(spyDidUnmount).toHaveBeenCalledTimes(1);
    expect(spyDependencies).toHaveBeenCalledTimes(4);

    hookB.unmount();
    expect(spyDidMount).toHaveBeenCalledTimes(2);
    expect(spyDidUnmount).toHaveBeenCalledTimes(2);
    expect(spyDependencies).toHaveBeenCalledTimes(4);
  });
});
