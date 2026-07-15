import { NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth/server";
import { enterpriseAuthConfig } from "@/lib/auth/config";
import { proxyXApiBearerRequest } from "@/lib/bff/proxyRoute";

export async function GET() {
  const session = await getServerAuthSession(enterpriseAuthConfig);
  const bearerToken = session.accessToken ?? session.gat;

  if (!bearerToken) {
    return NextResponse.json(
      { statusCode: 401, message: "Missing bearer token in session" },
      { status: 401 },
    );
  }

  return proxyXApiBearerRequest(bearerToken, {
    path: "v1/me",
    method: "GET",
  });
}
