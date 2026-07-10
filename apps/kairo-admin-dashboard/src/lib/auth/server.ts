import { cookies } from "next/headers";
import {
  getAuthSession,
  type AuthCookieConfig,
  type AuthSessionData,
} from "@kairo/auth";

export async function getServerAuthSession(
  config: AuthCookieConfig,
): Promise<AuthSessionData> {
  const cookieStore = await cookies();
  return getAuthSession(cookieStore, config);
}

export async function getServerGat(
  config: AuthCookieConfig,
): Promise<string | undefined> {
  const session = await getServerAuthSession(config);
  return session.gat ?? session.accessToken;
}
