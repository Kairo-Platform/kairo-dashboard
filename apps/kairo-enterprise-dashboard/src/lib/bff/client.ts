type BffRequestOptions = {
  method?: string;
  query?: Record<string, string | number | boolean>;
  body?: unknown;
};

export async function bffRequest<T>(
  basePath: string,
  path: string,
  { method = "GET", query, body }: BffRequestOptions = {},
): Promise<T> {
  const normalizedPath = `${basePath.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  const url = new URL(normalizedPath, "http://localhost");

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });
  }

  const response = await fetch(url.pathname + url.search, {
    method,
    credentials: "include",
    headers:
      body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  return (await response.json()) as T;
}

export const xApiBff = {
  request: <T>(path: string, options?: BffRequestOptions) =>
    bffRequest<T>("/api/x-api", path, options),
};
