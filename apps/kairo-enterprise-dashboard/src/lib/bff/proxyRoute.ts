import { NextResponse } from "next/server";
import {
  proxyServiceRequest,
  type ProxyServiceOptions,
  type ProxyServiceResult,
} from "@kairo/services";
import { getServerAuthSession } from "@/lib/auth/server";
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

// When a session token exists, forwards as Bearer. Otherwise falls back to service Basic auth.
export async function proxyXApiRequest(
  options: Omit<ProxyServiceOptions, "gat" | "auth" | "headers"> & {
    headers?: Record<string, string>;
  },
) {
  const session = await getServerAuthSession(enterpriseAuthConfig);
  const bearerToken = session.accessToken ?? session.gat;

  if (bearerToken) {
    return proxyXApiBearerRequest(bearerToken, options);
  }

  const result = await proxyServiceRequest({
    ...options,
    auth: getXApiBasicAuth(),
    baseUrl: resolveXApiBaseUrl(),
    baseUrlEnvKey: options.baseUrlEnvKey ?? X_API_ENV_KEY,
  });

  return toNextResponse(result);
}

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
