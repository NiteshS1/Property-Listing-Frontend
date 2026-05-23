import type { ApiResponse } from '../types';
import { getStoredToken } from '../lib/token';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

type RequestOptions = {
  auth?: boolean;
};

let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: () => void): void {
  onUnauthorized = handler;
}

function handleUnauthorized(): void {
  onUnauthorized?.();
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  requestOptions: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (requestOptions.auth) {
    const token = getStoredToken();
    if (!token) {
      handleUnauthorized();
      throw new ApiError(401, 'Authentication required. Please login again.');
    }
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const body = (await response.json().catch(() => ({}))) as ApiResponse<T> & {
    message?: string;
  };

  if (response.status === 401) {
    handleUnauthorized();
  }

  if (!response.ok) {
    throw new ApiError(
      body.statusCode ?? response.status,
      body.message ?? 'Request failed',
    );
  }

  return body.data;
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),

  post: <T>(path: string, data: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(data) }),

  authGet: <T>(path: string) =>
    request<T>(path, { method: 'GET' }, { auth: true }),

  authPost: <T>(path: string, data: unknown) =>
    request<T>(
      path,
      { method: 'POST', body: JSON.stringify(data) },
      { auth: true },
    ),

  authPut: <T>(path: string, data: unknown) =>
    request<T>(
      path,
      { method: 'PUT', body: JSON.stringify(data) },
      { auth: true },
    ),

  authDelete: <T>(path: string) =>
    request<T>(path, { method: 'DELETE' }, { auth: true }),
};
