import { NextResponse } from "next/server";

const X_API_ENV_KEY = "KAIRO_X_API_URL";

function resolveXApiBaseUrl() {
  return (
    process.env.KAIRO_X_API_URL ??
    process.env.KAIRO_USER_SERVICE_URL ??
    process.env.KAIRO_ENTERPRISE_DASHBOARD_URL
  );
}

/** Returns the xApi Google OAuth start URL for the client to navigate to. */
export async function GET() {
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

  return NextResponse.json({
    redirectUrl: `${baseUrl}/v1/auth/oauth/google/start`,
  });
}
