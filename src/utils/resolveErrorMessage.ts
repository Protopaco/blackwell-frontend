import { ResponseError } from '@/api/generated/runtime';
import type { ErrorResponse } from '@/api/generated/models/ErrorResponse';

/**
 * Extracts the backend's own error message from a thrown `ResponseError`
 * (the generated client's non-2xx exception, which only carries the raw
 * `Response` — the JSON body has to be parsed separately). Falls back to a
 * caller-supplied message for anything else (network failure, etc.).
 */
const resolveErrorMessage = async (error: unknown, fallback: string): Promise<string> => {
  if (error instanceof ResponseError) {
    const body: ErrorResponse | null = await error.response.json().catch(() => null);
    return body?.message ?? fallback;
  }
  return fallback;
};

export default resolveErrorMessage;
