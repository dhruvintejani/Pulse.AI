type ApiTokenProvider = () => Promise<string | null>;

let apiTokenProvider: ApiTokenProvider | null = null;

export const setApiTokenProvider = (provider: ApiTokenProvider) => {
  apiTokenProvider = provider;
};

export const clearApiTokenProvider = () => {
  apiTokenProvider = null;
};

export const getApiAuthToken = async () => {
  if (!apiTokenProvider) return null;
  return apiTokenProvider();
};
