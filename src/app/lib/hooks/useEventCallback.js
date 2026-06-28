import { useCallback, useRef } from "react";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

/**
 * Custom hook that creates a memoized event callback.
 * @param {function} fn - The callback function.
 * @returns {function} A memoized event callback function.
 * @public
 * @example
 * ```tsx
 * const handleClick = useEventCallback((event) => {
 *   // Handle the event here
 * });
 * ```
 */
export function useEventCallback(fn) {
  const ref = useRef(() => {
    throw new Error("Cannot call an event handler while rendering.");
  });

  useIsomorphicLayoutEffect(() => {
    ref.current = fn;
  }, [fn]);

  return useCallback((...args) => ref.current?.(...args), [ref]);
}

export default useEventCallback;
