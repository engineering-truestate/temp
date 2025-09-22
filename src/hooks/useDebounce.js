import { useEffect, useRef } from "react";

export function useDebounce(callback, delay) {
  const latestCallback = useRef(callback);
  const timer = useRef();

  useEffect(() => {
    latestCallback.current = callback;
  });

  const debouncedFunction = (...args) => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      latestCallback.current(...args);
    }, delay);
  };

  return debouncedFunction;
}
