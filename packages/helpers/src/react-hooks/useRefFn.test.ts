import { renderHook } from '@testing-library/react-hooks';
import { useRefFn } from './useRefFn';

describe('useRefFn', () => {
  it('should invoke the function once and always returns the same result', () => {
    const { result, rerender } = renderHook(() => useRefFn(() => ({ date: Date.now() })));
    const firstResult = result.current.current;
    const firstDate = firstResult.date;
    expect(typeof firstDate).toBe('number');
    rerender();
    expect(result.current.current).toBe(firstResult);
    expect(result.current.current.date).toBe(firstDate);
  });
});
