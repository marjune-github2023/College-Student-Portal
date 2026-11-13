export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

/**
 * All portal API calls go through here: same-origin credentials for the session
 * cookie and the custom header the API requires on state-changing requests.
 */
export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      ...(init.headers as Record<string, string> | undefined),
    },
  });

  const raw = await response.text();
  let data: unknown = null;
  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const body = (data ?? {}) as { message?: string; error?: string };
    throw new ApiError(body.message ?? "Request failed.", response.status, body.error);
  }

  return data as T;
}
