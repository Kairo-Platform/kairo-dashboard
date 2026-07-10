export function getApiData<T = unknown>(response: unknown): T | null {
  if (!response || typeof response !== "object") {
    return (response as T) ?? null;
  }

  const payload = response as {
    body?: { data?: T };
    data?: T;
  };

  return payload.body?.data ?? payload.data ?? (response as T);
}

export function isApiError(response: unknown): boolean {
  if (!response || typeof response !== "object") return false;

  const payload = response as {
    errCode?: unknown;
    statusCode?: number;
  };

  return Boolean(payload.errCode) || Boolean(
    payload.statusCode && payload.statusCode !== 200,
  );
}
