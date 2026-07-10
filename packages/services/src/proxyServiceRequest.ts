import { generateService, type RequestParams } from "./generateService";

export type ProxyServiceOptions = {
  gat?: string;
  baseUrl?: string;
  baseUrlEnvKey?: string;
  auth?: { username?: string; password?: string };
} & RequestParams;

export type ProxyServiceSuccess = {
  ok: true;
  data: unknown;
};

export type ProxyServiceFailure = {
  ok: false;
  status: number;
  body: {
    statusCode: number;
    message: string;
  };
};

export type ProxyServiceResult = ProxyServiceSuccess | ProxyServiceFailure;

export async function proxyServiceRequest({
  gat,
  baseUrl,
  baseUrlEnvKey = "KAIRO_DASHBOARD_URL",
  auth,
  path,
  method = "GET",
  query,
  data,
  body,
  headers,
}: ProxyServiceOptions): Promise<ProxyServiceResult> {
  try {
    const service = generateService({ gat, auth, baseUrl, baseUrlEnvKey });
    const result = await service({
      path,
      method,
      query,
      data,
      body,
      headers,
    });

    return { ok: true, data: result };
  } catch (error) {
    const status =
      error instanceof Error && "status" in error
        ? Number((error as Error & { status?: number }).status) || 500
        : 500;

    return {
      ok: false,
      status,
      body: {
        statusCode: status,
        message: error instanceof Error ? error.message : "Request failed",
      },
    };
  }
}
