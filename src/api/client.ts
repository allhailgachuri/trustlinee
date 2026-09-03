/**
 * Trustline Hybrid API Client
 *
 * Provides a unified async transport layer.
 * When `VITE_API_URL` is set, requests are routed to the FastAPI backend microservice.
 * In standalone / evaluation sandbox mode, requests seamlessly resolve against
 * the in-memory dataset with simulated network latency.
 */

export const IS_PRODUCTION = import.meta.env.PROD;
export const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export const sleep = (ms = 140) => new Promise((resolve) => setTimeout(resolve, ms));

export class ApiError extends Error {
  constructor(
    message: string,
    public status = 400,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
  fallbackFn?: () => Promise<T>,
): Promise<T> {
  if (API_BASE_URL) {
    try {
      const url = `${API_BASE_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new ApiError(
          errData.detail || errData.message || `API Error: ${res.statusText}`,
          res.status,
          errData,
        );
      }

      return (await res.json()) as T;
    } catch (err: any) {
      if (fallbackFn && !(err instanceof ApiError && err.status >= 400 && err.status < 500)) {
        console.warn(`[Trustline Client] Live backend unreachable at ${API_BASE_URL}, falling back to local sandbox engine:`, err.message);
        return fallbackFn();
      }
      throw err;
    }
  }

  if (fallbackFn) {
    await sleep();
    return fallbackFn();
  }

  throw new ApiError("No API endpoint configured and no sandbox fallback provided.", 500);
}
