export type ServiceConfig = {
  baseUrl?: string;
  auth?: { username?: string; password?: string };
  /** GAT token when running in server context */
  gat?: string;
  /** Env var name to resolve base URL when baseUrl is omitted */
  baseUrlEnvKey?: string;
};

export type RequestParams = {
  path: string;
  query?: Record<string, string | number | boolean>;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  data?: unknown;
  body?: unknown;
  headers?: Record<string, string>;
};

function buildUrl(base = "", path = "", query?: Record<string, unknown>) {
  if (typeof path === "string" && /^https?:\/\//i.test(path)) {
    const u = new URL(path);
    if (query) {
      Object.entries(query).forEach(([k, v]) =>
        u.searchParams.set(k, String(v)),
      );
    }
    return u.toString();
  }

  if (typeof base === "string" && /^https?:\/\//i.test(base)) {
    const trimmedBase = base.replace(/\/$/, "");
    const trimmedPath = (path ?? "").replace(/^\//, "");
    const joined = trimmedPath ? `${trimmedBase}/${trimmedPath}` : trimmedBase;
    const u = new URL(joined);
    if (query) {
      Object.entries(query).forEach(([k, v]) =>
        u.searchParams.set(k, String(v)),
      );
    }
    return u.toString();
  }

  const normalizedPath = path
    ? path.startsWith("/")
      ? path
      : `/${path}`
    : "/";
  const u = new URL(normalizedPath, "http://example.invalid");
  if (query) {
    Object.entries(query).forEach(([k, v]) => u.searchParams.set(k, String(v)));
  }
  return u.pathname + (u.search || "");
}

function basicAuthHeader(username?: string, password?: string) {
  if (!username && !password) return undefined;
  if (typeof window === "undefined") {
    return (
      "Basic " +
      Buffer.from(`${username ?? ""}:${password ?? ""}`).toString("base64")
    );
  }
  return "Basic " + btoa(`${username ?? ""}:${password ?? ""}`);
}

export function generateService(serviceConfig: ServiceConfig = {}) {
  const {
    baseUrl = "",
    auth = {},
    gat: configGat,
    baseUrlEnvKey = "KAIRO_DASHBOARD_URL",
  } = serviceConfig;

  const resolvedBaseUrl =
    baseUrl ||
    (typeof process !== "undefined" &&
      (process.env[baseUrlEnvKey] as string | undefined)) ||
    "";

  if (!resolvedBaseUrl) {
    throw new Error(
      `baseUrl is required for service calls. Set ${baseUrlEnvKey}.`,
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

    const gat = configGat;
    const shortcode =
      typeof window !== "undefined"
        ? window.localStorage?.getItem("shortcode") ?? undefined
        : undefined;
    const managerId =
      typeof window !== "undefined"
        ? window.localStorage?.getItem("manager_id") ?? undefined
        : undefined;

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
    let json: unknown = undefined;
    try {
      json = text ? JSON.parse(text) : undefined;
    } catch {
      // non-json response
    }
    if (!res.ok) {
      const err =
        (json &&
          typeof json === "object" &&
          "message" in json &&
          json.message) ||
        res.statusText;
      const error = new Error(String(err));
      (error as Error & { status?: number; body?: unknown }).status = res.status;
      (error as Error & { status?: number; body?: unknown }).body = json;
      throw error;
    }
    return json;
  };
}
