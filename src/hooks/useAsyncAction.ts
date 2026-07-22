import { useState } from 'react';
import resolveErrorMessage from '@/utils/resolveErrorMessage';

type AsyncActionResult = {
  run: () => Promise<void>;
  loading: boolean;
  errorMessage: string | null;
};

/**
 * Wraps a button-triggered async action (Generate Timesheets, Generate Payroll
 * Report, Close Pay Period, etc.) with the disable-while-in-flight + loading
 * indicator baseline every such control needs (`STYLE_GUIDE.md` §8), plus
 * surfacing the backend's own validation message on failure via
 * `resolveErrorMessage` rather than a generic string.
 */
const useAsyncAction = (action: () => Promise<void>, fallbackErrorMessage: string): AsyncActionResult => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const run = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      await action();
    } catch (error) {
      console.error(fallbackErrorMessage, error);
      setErrorMessage(await resolveErrorMessage(error, fallbackErrorMessage));
    } finally {
      setLoading(false);
    }
  };

  return { run, loading, errorMessage };
};

export default useAsyncAction;
