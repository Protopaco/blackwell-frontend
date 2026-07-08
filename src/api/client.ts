// Placeholder API client wrapper
// Replace implementation when OpenAPI client is generated.

export type ApiClientConfig = {
  baseUrl: string;
  withCredentials?: boolean;
};

export const createApiClient = (config: ApiClientConfig) => {
  return {
    baseUrl: config.baseUrl,
    withCredentials: config.withCredentials ?? true,
  };
};
