import { useEffect, useRef, useState } from 'react';

type FetchByKeyResult<T> = {
  data: T | null;
  errorMessage: string | null;
  loading: boolean;
};

type FetchByKeyState<T> = {
  key: string;
  data: T | null;
  errorMessage: string | null;
};

/**
 * Fetches `fetcher(key)` whenever `key` changes, guarding against the two races
 * that come with a component being reused across keys (e.g. navigating between
 * two clients/pay periods without an unmount): an in-flight response for a
 * stale key landing after a newer one already resolved, and briefly rendering
 * the previous key's data under the new key before its fetch resolves.
 */
const useFetchByKey = <T>(key: string | undefined, fetcher: (key: string) => Promise<T>, errorMessage: string): FetchByKeyResult<T> => {
  const [state, setState] = useState<FetchByKeyState<T> | null>(null);
  const fetcherRef = useRef(fetcher);

  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  useEffect(() => {
    if (!key) return;

    let cancelled = false;

    fetcherRef
      .current(key)
      .then((data) => {
        if (cancelled) return;
        setState({ key, data, errorMessage: null });
      })
      .catch((error) => {
        console.error(errorMessage, error);
        if (cancelled) return;
        setState({ key, data: null, errorMessage });
      });

    return () => {
      cancelled = true;
    };
  }, [key, errorMessage]);

  const isCurrent = state !== null && state.key === key;

  return {
    data: isCurrent ? state.data : null,
    errorMessage: isCurrent ? state.errorMessage : null,
    loading: !key || !isCurrent,
  };
};

export default useFetchByKey;
