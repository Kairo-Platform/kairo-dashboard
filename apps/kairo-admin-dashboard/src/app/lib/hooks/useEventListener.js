import { useEffect, useRef } from "react";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

/**
 * Custom hook that attaches event listeners to DOM elements, the window, or media query lists.
 * @param {string} eventName - The name of the event to listen for.
 * @param {function} handler - The event handler function.
 * @param {object} [element] - The DOM element or media query list to attach the event listener to (optional).
 * @param {boolean | object} [options] - An options object that specifies characteristics about the event listener (optional).
 * @public
 * @example
 * ```tsx
 * // Example 1: Attach a window event listener
 * useEventListener('resize', handleResize);
 * ```
 * @example
 * ```tsx
 * // Example 2: Attach a document event listener with options
 * const elementRef = useRef(document);
 * useEventListener('click', handleClick, elementRef, { capture: true });
 * ```
 * @example
 * ```tsx
 * // Example 3: Attach an element event listener
 * const buttonRef = useRef(null);
 * useEventListener('click', handleButtonClick, buttonRef);
 * ```
 */
export function useEventListener(eventName, handler, element, options) {
  // Create a ref that stores handler
  const savedHandler = useRef(handler);

  useIsomorphicLayoutEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    // Define the listening target
    const targetElement = element?.current ?? window;

    if (!(targetElement && targetElement.addEventListener)) return;

    // Create event listener that calls handler function stored in ref
    const listener = (event) => {
      savedHandler.current(event);
    };

    targetElement.addEventListener(eventName, listener, options);

    // Remove event listener on cleanup
    return () => {
      targetElement.removeEventListener(eventName, listener, options);
    };
  }, [eventName, element, options]);
}

export default useEventListener;
