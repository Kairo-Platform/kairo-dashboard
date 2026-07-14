import { NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth/server";
import { enterpriseAuthConfig } from "@/lib/auth/config";
import { proxyXApiBearerRequest } from "@/lib/bff/proxyRoute";

export async function GET() {
  const session = await getServerAuthSession(enterpriseAuthConfig);
  const userId = session.userId;
  const bearerToken = session.accessToken ?? session.gat;

  if (!userId) {
    return NextResponse.json(
      { statusCode: 401, message: "Missing user id in session" },
      { status: 401 },
    );
  }

  if (!bearerToken) {
    return NextResponse.json(
      { statusCode: 401, message: "Missing bearer token in session" },
      { status: 401 },
    );
  }

  return proxyXApiBearerRequest(bearerToken, {
    path: `v1/me/${userId}`,
    method: "GET",
  });
}
