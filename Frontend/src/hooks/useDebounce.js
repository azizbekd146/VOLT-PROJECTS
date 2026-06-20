import { useEffect, useState } from "react";

/**
 * useDebounce — delays updating a value until it has stopped changing for
 * `delay` ms. Used by the navbar search so we're not re-filtering the
 * product grid on every keystroke.
 */
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debounced;
}
