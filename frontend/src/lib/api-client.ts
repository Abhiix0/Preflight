const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export interface ApiClientOptions {
  headers?: Record<string, string>;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = new Headers(options.headers);
    headers.set("Content-Type", "application/json");
    headers.set("Accept", "application/json");

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
      credentials: "include",
    });

    if (response.status === 204 || response.headers.get("content-length") === "0") {
      return undefined as unknown as T;
    }

    const json = await response.json();

    if (!response.ok) {
      throw new ApiError(
        response.status,
        json.error?.code || "SERVER_ERROR",
        json.error?.message || "An unexpected error occurred",
        json.error?.details
      );
    }

    if (json.success === false) {
      throw new ApiError(
        response.status,
        json.error?.code || "API_ERROR",
        json.error?.message || "API returned success: false",
        json.error?.details
      );
    }

    return json.data;
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    return this.request<T>(`${endpoint}${queryString}`, { method: "GET" });
  }

  async post<T>(
    endpoint: string,
    body?: unknown,
    options: RequestInit = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  async patch<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
