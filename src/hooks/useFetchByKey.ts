import { useEffect, useRef, useState } from 'react';

type FetchByKeyResult<T> = {
  data: T | null;
  errorMessage: string | null;
  loading: boolean;
  refetch: () => void;
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
 *
 * `refetch()` forces the same key to be fetched again — for when a mutation
 * elsewhere (e.g. generating a payroll report) changes data this hook already
 * loaded, and the display needs to catch up without waiting for `key` itself
 * to change.
 */
const useFetchByKey = <T>(key: string | undefined, fetcher: (key: string) => Promise<T>, errorMessage: string): FetchByKeyResult<T> => {
  const [state, setState] = useState<FetchByKeyState<T> | null>(null);
  const [refetchNonce, setRefetchNonce] = useState(0);
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
  }, [key, errorMessage, refetchNonce]);

  const isCurrent = state !== null && state.key === key;

  return {
    data: isCurrent ? state.data : null,
    errorMessage: isCurrent ? state.errorMessage : null,
    loading: !key || !isCurrent,
    refetch: () => setRefetchNonce((nonce) => nonce + 1),
  };
};

export default useFetchByKey;
