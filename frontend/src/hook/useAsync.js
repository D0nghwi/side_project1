import { useCallback, useState } from "react";

export function useAsync(initialValue = null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [value, setValue] = useState(initialValue);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setValue(initialValue);
  }, [initialValue]);

  /**
   * @param {Function} fn async function returning a value
   * @param {Object} options
   *  - onSuccess(result)
   *  - onError(error)
   *  - throwError: boolean (default false)
   */
  const run = useCallback(
    async (fn, options = {}) => {
      const { onSuccess, onError, throwError = false } = options;

      setLoading(true);
      setError(null);

      try {
        const result = await fn();
        setValue(result);
        onSuccess?.(result);
        return result;
      } catch (e) {
        setError(e);
        onError?.(e);
        if (throwError) throw e;
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { loading, error, value, setValue, setError, run, reset };
}
