const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;

let didWarnMissingApiBaseUrl = false;

export const env = {
  API_BASE_URL: apiBaseUrl?.trim() ?? "",
};

export function getApiBaseUrl() {
  if (!env.API_BASE_URL && !didWarnMissingApiBaseUrl) {
    didWarnMissingApiBaseUrl = true;
    console.warn("VITE_API_BASE_URL is not configured. API requests will fail until it is set.");
  }

  return env.API_BASE_URL;
}
