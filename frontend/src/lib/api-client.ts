const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

export interface ApiClientOptions {
  headers?: Record<string, string>;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async getAuthToken(): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('preflight_token');
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAuthToken();

    const headers = new Headers(options.headers);
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    const json = await response.json();

    if (!response.ok) {
      // Handle standard error shape from Api-specification.md section 5
      throw {
        status: response.status,
        code: json.error?.code || 'SERVER_ERROR',
        message: json.error?.message || 'An unexpected error occurred',
        details: json.error?.details,
      };
    }

    // According to spec, success responses are wrapped in { success, message, data }
    if (json.success === false) {
      throw {
        status: response.status,
        code: json.error?.code || 'API_ERROR',
        message: json.error?.message || 'API returned success: false',
        details: json.error?.details,
      };
    }

    return json.data;
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const queryString = params
      ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
      : '';
    return this.request<T>(`${endpoint}${queryString}`, { method: 'GET' });
  }

  async post<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async patch<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
