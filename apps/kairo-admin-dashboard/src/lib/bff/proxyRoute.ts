import { NextResponse } from "next/server";
import {
  proxyServiceRequest,
  type ProxyServiceOptions,
  type ProxyServiceResult,
} from "@kairo/services";
import { getServerGat } from "@/lib/auth/server";
import { adminAuthConfig } from "@/lib/auth/config";

export const BACK_OFFICE_ENV_KEY = "KAIRO_BACK_OFFICE_URL";

function toNextResponse(result: ProxyServiceResult) {
  if (!result.ok) {
    return NextResponse.json(result.body, { status: result.status });
  }

  return NextResponse.json(result.data);
}

function getBackOfficeBasicAuth() {
  return {
    username:
      process.env.KAIRO_BACK_OFFICE_API_USERNAME ??
      process.env.KAIRO_DASHBOARD_API_USERNAME,
    password:
      process.env.KAIRO_BACK_OFFICE_API_PASSWORD ??
      process.env.KAIRO_DASHBOARD_API_PASSWORD,
  };
}

function resolveBackOfficeBaseUrl() {
  return (
    process.env.KAIRO_BACK_OFFICE_URL ??
    process.env.KAIRO_DASHBOARD_URL
  );
}

/** Proxies to the backOffice API. Sends GAT when present; always includes service credentials. */
export async function proxyBackOfficeRequest(
  options: Omit<ProxyServiceOptions, "gat" | "auth">,
) {
  const gat = await getServerGat(adminAuthConfig);
  const result = await proxyServiceRequest({
    ...options,
    gat,
    auth: getBackOfficeBasicAuth(),
    baseUrl: resolveBackOfficeBaseUrl(),
    baseUrlEnvKey: options.baseUrlEnvKey ?? BACK_OFFICE_ENV_KEY,
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
