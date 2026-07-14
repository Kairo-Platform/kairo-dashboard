import { NextResponse } from "next/server";
import {
  proxyServiceRequest,
  type ProxyServiceOptions,
  type ProxyServiceResult,
} from "@kairo/services";
import { getServerGat } from "@/lib/auth/server";
import { enterpriseAuthConfig } from "@/lib/auth/config";

export const X_API_ENV_KEY = "KAIRO_X_API_URL";

function toNextResponse(result: ProxyServiceResult) {
  if (!result.ok) {
    return NextResponse.json(result.body, { status: result.status });
  }

  return NextResponse.json(result.data);
}

function getXApiBasicAuth() {
  return {
    username:
      process.env.KAIRO_X_API_USERNAME ??
      process.env.KAIRO_USER_SERVICE_API_USERNAME ??
      process.env.KAIRO_ENTERPRISE_API_USERNAME,
    password:
      process.env.KAIRO_X_API_PASSWORD ??
      process.env.KAIRO_USER_SERVICE_API_PASSWORD ??
      process.env.KAIRO_ENTERPRISE_API_PASSWORD,
  };
}

export function resolveXApiBaseUrl() {
  return (
    process.env.KAIRO_X_API_URL ??
    process.env.KAIRO_USER_SERVICE_URL ??
    process.env.KAIRO_ENTERPRISE_DASHBOARD_URL
  );
}

/** Proxies to the xApi backend (user-facing endpoints). Sends GAT when present; always includes service credentials. */
export async function proxyXApiRequest(
  options: Omit<ProxyServiceOptions, "gat" | "auth">,
) {
  const gat = await getServerGat(enterpriseAuthConfig);
  const result = await proxyServiceRequest({
    ...options,
    gat,
    auth: getXApiBasicAuth(),
    baseUrl: resolveXApiBaseUrl(),
    baseUrlEnvKey: options.baseUrlEnvKey ?? X_API_ENV_KEY,
  });

  return toNextResponse(result);
}

/**
 * Proxies to xApi with `Authorization: Bearer <token>` only (no Basic / x-gat).
 * Used for endpoints that require a user bearer token (e.g. `/v1/me/:userId`).
 */
export async function proxyXApiBearerRequest(
  bearerToken: string,
  options: Omit<ProxyServiceOptions, "gat" | "auth" | "headers"> & {
    headers?: Record<string, string>;
  },
) {
  const result = await proxyServiceRequest({
    ...options,
    baseUrl: resolveXApiBaseUrl(),
    baseUrlEnvKey: options.baseUrlEnvKey ?? X_API_ENV_KEY,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${bearerToken}`,
    },
  });

  return toNextResponse(result);
}

export async function handleBffRequest(
  request: Request,
  pathSegments: string[],
  proxy: (
    options: Omit<ProxyServiceOptions, "gat" | "auth">,
  ) => Promise<NextResponse>,
) {
  const url = new URL(request.url);
  const query = Object.fromEntries(url.searchParams.entries());
  let body: unknown;

  if (!["GET", "HEAD"].includes(request.method)) {
    try {
      body = await request.json();
    } catch {
      body = undefined;
    }
  }

  return proxy({
    path: pathSegments.join("/"),
    method: request.method as ProxyServiceOptions["method"],
    query,
    body,
  });
}
