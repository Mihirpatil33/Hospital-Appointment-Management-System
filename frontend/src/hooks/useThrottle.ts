import { useRef, useCallback } from 'react';

/**
 * Returns a throttled version of `fn` that can only fire once per `delay` ms.
 * Useful for preventing double-submits on payment / review buttons.
 */
export function useThrottle<T extends (...args: any[]) => any>(fn: T, delay = 2000): T {
  const lastCall = useRef<number>(0);

  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      return fn(...args);
    }
  }, [fn, delay]) as T;
}
