import { NextResponse } from "next/server";

const X_API_ENV_KEY = "KAIRO_X_API_URL";

function resolveXApiBaseUrl() {
  return (
    process.env.KAIRO_X_API_URL ??
    process.env.KAIRO_USER_SERVICE_URL ??
    process.env.KAIRO_ENTERPRISE_DASHBOARD_URL
  );
}

export async function GET(request: Request) {
  const baseUrl = resolveXApiBaseUrl()?.replace(/\/$/, "");

  if (!baseUrl) {
    return NextResponse.json(
      {
        statusCode: 500,
        message: `${X_API_ENV_KEY} is not configured`,
      },
      { status: 500 },
    );
  }

  const returnTo = new URL(request.url).searchParams.get("returnTo");
  const startUrl = new URL(`${baseUrl}/v1/auth/oauth/google/start`);

  if (returnTo) {
    startUrl.searchParams.set("returnTo", returnTo);
  }

  return NextResponse.json({
    redirectUrl: startUrl.toString(),
  });
}
