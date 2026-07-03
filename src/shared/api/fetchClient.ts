import { ApiError } from "@/shared/api/ApiError";
import type { RequestOptions } from "@/shared/api/types";
import { getApiBaseUrl } from "@/shared/lib/env";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

function buildUrl(path: string) {
  const baseUrl = getApiBaseUrl();

  if (!baseUrl) {
    throw new ApiError("VITE_API_BASE_URL is not configured.");
  }

  try {
    return new URL(path, baseUrl).toString();
  } catch (error) {
    throw new ApiError("VITE_API_BASE_URL is invalid.", { details: error });
  }
}

function resolveCredentials(credentials: RequestOptions["credentials"]): RequestCredentials | undefined {
  if (typeof credentials === "boolean") {
    return credentials ? "include" : undefined;
  }

  return credentials;
}

async function parseResponseBody(response: Response) {
  const text = await response.text();
  if (!text) return undefined;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

async function request<T>(method: HttpMethod, path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, userId, credentials = false, ...init } = options;
  const requestHeaders = new Headers(headers);
  const hasJsonBody = body !== undefined;

  if (hasJsonBody && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (userId !== undefined) {
    requestHeaders.set("X-User-Id", String(userId));
  }

  const response = await fetch(buildUrl(path), {
    ...init,
    method,
    headers: requestHeaders,
    body: hasJsonBody ? JSON.stringify(body) : undefined,
    credentials: resolveCredentials(credentials),
  });

  if (response.status === 204) {
    if (!response.ok) throw ApiError.fromResponse(response.status, undefined);
    return undefined as T;
  }

  const responseBody = await parseResponseBody(response);

  if (!response.ok) {
    throw ApiError.fromResponse(response.status, responseBody);
  }

  return responseBody as T;
}

export const fetchClient = {
  get: <T>(path: string, options?: RequestOptions) => request<T>("GET", path, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) => request<T>("POST", path, { ...options, body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) => request<T>("PATCH", path, { ...options, body }),
  delete: <T>(path: string, options?: RequestOptions) => request<T>("DELETE", path, options),
};
