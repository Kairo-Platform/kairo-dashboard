const isBrowser = () => typeof window !== "undefined";

const SESSION_API = "/api/auth/session";

type SessionCache = {
  authenticated: boolean;
  userId: string | null;
  userType: string | null;
  orgId: string | null;
};

let sessionCache: SessionCache = {
  authenticated: false,
  userId: null,
  userType: null,
  orgId: null,
};

export type AuthSessionPayload = {
  gat?: string;
  userId?: string;
  userType?: string;
  orgId?: string;
  accessToken?: string;
  refreshToken?: string;
};

const persistSession = async (session: AuthSessionPayload): Promise<void> => {
  if (!isBrowser()) return;

  await fetch(SESSION_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(session),
  });
};

const clearSession = async (): Promise<void> => {
  if (!isBrowser()) return;

  await fetch(SESSION_API, { method: "DELETE", credentials: "include" });
  sessionCache = {
    authenticated: false,
    userId: null,
    userType: null,
    orgId: null,
  };
};

const syncSessionFromServer = async (): Promise<SessionCache> => {
  if (!isBrowser()) return sessionCache;

  try {
    const response = await fetch(SESSION_API, { credentials: "include" });
    const data = (await response.json()) as {
      authenticated?: boolean;
      userId?: string;
      userType?: string;
      orgId?: string;
    };

    sessionCache = {
      authenticated: Boolean(data.authenticated),
      userId: data.userId ?? null,
      userType: data.userType ?? null,
      orgId: data.orgId ?? null,
    };
  } catch {
    sessionCache = {
      authenticated: false,
      userId: null,
      userType: null,
      orgId: null,
    };
  }

  return sessionCache;
};

export const setAuthSession = async (
  session: AuthSessionPayload,
): Promise<void> => {
  if (session.gat || session.accessToken || session.refreshToken) {
    sessionCache.authenticated = true;
  }
  if (session.userId) sessionCache.userId = session.userId;
  if (session.userType) sessionCache.userType = session.userType;
  if (session.orgId) sessionCache.orgId = session.orgId;

  await persistSession(session);
};

export const hydrateSession = (): Promise<SessionCache> =>
  syncSessionFromServer();

export const isLoggedIn = async (): Promise<boolean> => {
  const session = await syncSessionFromServer();
  return session.authenticated;
};

export const getUserId = (): string | null => sessionCache.userId;

export const getUserType = (): string | null => sessionCache.userType;

export const getOrgId = (): string | null => sessionCache.orgId;

export const logout = async (
  callback?: () => void | Promise<void>,
): Promise<void> => {
  if (isBrowser()) {
    await clearSession();
  }
  if (callback) await callback();
};

export function applyAuthPayload(
  user: { id?: string; type?: string; userType?: string } | null,
  gat?: string,
): void {
  const userType = user?.type || user?.userType;

  if (gat || user?.id || userType) {
    void setAuthSession({
      gat,
      userId: user?.id,
      userType,
    });
  }
}

/** Persist OAuth handoff (`token`, `userId`, `orgId`) into the session cookies. */
export async function applyOAuthSession(params: {
  token: string;
  userId: string;
  orgId?: string | null;
}): Promise<void> {
  await setAuthSession({
    accessToken: params.token,
    // Keep gat in sync so existing GAT-based BFF paths still work.
    gat: params.token,
    userId: params.userId,
    orgId: params.orgId ?? undefined,
  });
}

export const AuthUtils = {
  setAuthSession,
  hydrateSession,
  isLoggedIn,
  logout,
  getUserId,
  getUserType,
  getOrgId,
  applyAuthPayload,
  applyOAuthSession,
};

export default AuthUtils;
