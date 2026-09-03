/**
 * Trustline Mock API Client
 *
 * Implements a clean async service layer with simulated latency.
 * Prepared for one-line swap to real FastAPI endpoints via `VITE_API_URL`.
 */

export const IS_PRODUCTION = import.meta.env.PROD;
export const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export const sleep = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms));

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
