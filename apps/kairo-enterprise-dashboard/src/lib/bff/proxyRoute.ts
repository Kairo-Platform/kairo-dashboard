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

async function receiveKnowledgeUpload(request: Request): Promise<FormData> {
  const limit = 12 * 1024 * 1024;
  if (Number(request.headers.get("content-length")) > limit) {
    throw new RangeError("Knowledge files must be 10 MB or smaller");
  }
  const reader = request.body?.getReader();
  if (!reader) throw new Error("A file is required");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) {
        await reader.cancel();
        throw new RangeError("Knowledge files must be 10 MB or smaller");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new Response(bytes, {
    headers: { "content-type": request.headers.get("content-type") ?? "" },
  }).formData();
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
  const knowledgeUpload =
    request.method === "POST" &&
    /^v1\/orgs\/[^/]+\/agents\/flow\/settings\/knowledge\/files$/.test(
      pathSegments.join("/"),
    );
  if (knowledgeUpload) {
    const session = await getServerAuthSession(enterpriseAuthConfig);
    if (!session.accessToken && !session.gat) {
      return NextResponse.json(
        { error: "Please sign in to upload knowledge" },
        { status: 401 },
      );
    }
  }

  if (!["GET", "HEAD"].includes(request.method)) {
    try {
      body = request.headers
        .get("content-type")
        ?.includes("multipart/form-data")
        ? knowledgeUpload
          ? await receiveKnowledgeUpload(request)
          : await request.formData()
        : await request.json();
    } catch (error) {
      if (knowledgeUpload) {
        return NextResponse.json(
          {
            error:
              error instanceof RangeError
                ? error.message
                : "The file could not be read. Please select it again.",
          },
          { status: error instanceof RangeError ? 413 : 400 },
        );
      }
      body = undefined;
    }
  }

  return proxy({
    path: pathSegments.join("/"),
    method: request.method as ProxyServiceOptions["method"],
    query,
    body,
    headers: request.headers.get("x-api-key")
      ? { "X-Api-Key": request.headers.get("x-api-key")! }
      : undefined,
  });
}
