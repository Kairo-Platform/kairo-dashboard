export type ServiceConfig = {
  baseUrl?: string;
  auth?: { username?: string; password?: string };
  // allow supplying a GAT token when running in server context
  gat?: string;
};

export type RequestParams = {
  path: string;
  query?: Record<string, string | number | boolean>;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  data?: unknown;
  body?: unknown;
  headers?: Record<string, string>;
};

// Robust helper to build URL that supports a base which may include a pathname.
function buildUrl(base = "", path = "", query?: Record<string, any>) {
  if (typeof path === "string" && /^https?:\/\//i.test(path)) {
    const u = new URL(path);
    if (query)
      Object.entries(query).forEach(([k, v]) =>
        u.searchParams.set(k, String(v)),
      );
    return u.toString();
  }

  if (typeof base === "string" && /^https?:\/\//i.test(base)) {
    const trimmedBase = base.replace(/\/$/, "");
    const trimmedPath = (path ?? "").replace(/^\//, "");
    const joined = trimmedPath ? `${trimmedBase}/${trimmedPath}` : trimmedBase;
    const u = new URL(joined);
    if (query)
      Object.entries(query).forEach(([k, v]) =>
        u.searchParams.set(k, String(v)),
      );
    return u.toString();
  }

  const normalizedPath = path
    ? path.startsWith("/")
      ? path
      : `/${path}`
    : "/";
  const u = new URL(normalizedPath, "http://example.invalid");
  if (query)
    Object.entries(query).forEach(([k, v]) => u.searchParams.set(k, String(v)));
  return u.pathname + (u.search || "");
}

// helpers to produce Authorization header safely both in Node and Browser
function basicAuthHeader(username?: string, password?: string) {
  if (!username && !password) return undefined;
  if (typeof window === "undefined") {
    // Node runtime
    return (
      "Basic " +
      Buffer.from(`${username ?? ""}:${password ?? ""}`).toString("base64")
    );
  } else {
    // Browser
    return "Basic " + btoa(`${username ?? ""}:${password ?? ""}`);
  }
}

export function generateService(serviceConfig: ServiceConfig = {}) {
  const { baseUrl = "", auth = {}, gat: configGat } = serviceConfig;

  // Resolve base URL
  const resolvedBaseUrl =
    baseUrl ||
    (typeof process !== "undefined" &&
      (process.env.KAIRO_DASHBOARD_URL as string)) ||
    "";

  if (!resolvedBaseUrl) {
    throw new Error(
      "baseUrl is required for service calls. Set KAIRO_DASHBOARD_URL.",
    );
  }

  return async function service(requestParams: RequestParams) {
    const {
      path,
      query,
      method = "GET",
      data,
      body,
      headers: initialHeaders = {},
    } = requestParams;

    const payload = data ?? body;

    // Prefer token passed in via service config (server-side). Fall back to
    // browser localStorage when running in the client.
    const gatFromStorage =
      (typeof window !== "undefined" &&
        (window as any).localStorage?.getItem("kr_gat")) ??
      undefined;
    const gat = configGat ?? gatFromStorage;
    const shortcode =
      (typeof window !== "undefined" &&
        (window as any).localStorage?.getItem("shortcode")) ??
      undefined;
    const managerId =
      (typeof window !== "undefined" &&
        (window as any).localStorage?.getItem("manager_id")) ??
      undefined;

    const authHeader = basicAuthHeader(auth.username, auth.password);

    const headers: Record<string, string> = {
      ...(gat ? { "x-gat": gat } : {}),
      ...(shortcode ? { shortcode } : {}),
      ...(managerId ? { manager_id: managerId } : {}),
      ...initialHeaders,
      ...(authHeader ? { Authorization: authHeader } : {}),
    };

    const isFormData = payload instanceof FormData;
    const requestBody = isFormData
      ? (payload as FormData)
      : payload !== undefined
        ? JSON.stringify(payload)
        : undefined;
    if (!isFormData && payload !== undefined && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    const url = buildUrl(resolvedBaseUrl, path, query);

    const opts: RequestInit = { method, headers, body: requestBody };

    const res = await fetch(url, opts);
    const text = await res.text();
    let json: any = undefined;
    try {
      json = text ? JSON.parse(text) : undefined;
    } catch (e) {
      // non-json response
    }
    if (!res.ok) {
      const err = (json && json.message) || res.statusText;
      const error = new Error(String(err));
      (error as any).status = res.status;
      (error as any).body = json;
      throw error;
    }
    return json;
  };
}
