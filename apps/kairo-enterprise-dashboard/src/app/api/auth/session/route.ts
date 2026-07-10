import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  clearAuthSession,
  getPublicSession,
  setAuthSession,
  type AuthSessionData,
} from "@kairo/auth";
import { enterpriseAuthConfig } from "@/lib/auth/config";

export async function GET() {
  const cookieStore = await cookies();
  const session = getPublicSession(cookieStore, enterpriseAuthConfig);
  return NextResponse.json(session);
}

export async function POST(request: Request) {
  const body = (await request.json()) as AuthSessionData;
  const cookieStore = await cookies();

  setAuthSession(cookieStore, enterpriseAuthConfig, {
    gat: body.gat,
    userId: body.userId,
    userType: body.userType,
    accessToken: body.accessToken,
    refreshToken: body.refreshToken,
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  clearAuthSession(cookieStore, enterpriseAuthConfig);
  return NextResponse.json({ ok: true });
}
