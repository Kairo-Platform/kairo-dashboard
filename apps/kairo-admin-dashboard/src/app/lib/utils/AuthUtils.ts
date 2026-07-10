import { isBrowser } from "@/app/lib/utils";
import { resetAuthUser, disableDarkMode, setAuthUser } from "@/app/store/auth";
import { SERVER_CODE } from "@/app/lib/shared-constants";

const gatStorageKey = "kr_gat";
const distributionManagerIdStorageKey = "kr_dm_id";
const darkModeStorageKey = "kr_dark_mode";
const invitedUserSessionIdStorageKey = "kr_invited_user_session_id";

const SESSION_API = "/api/auth/session";

type SessionCache = {
  authenticated: boolean;
  userId: string | null;
  userType: string | null;
};

let sessionCache: SessionCache = {
  authenticated: false,
  userId: null,
  userType: null,
};

const getServerCode = (): string | undefined =>
  SERVER_CODE[gatStorageKey as keyof typeof SERVER_CODE];

const setKeyInStorage = (storageKey: string, value: unknown = ""): void => {
  if (!isBrowser() || !storageKey) return;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(value));
  } catch (err) {
    void err;
  }
};

const getKeyFromStorage = <T = unknown>(
  storageKey: string,
  defaultValue: T,
): T => {
  if (!storageKey) return defaultValue;
  if (!isBrowser()) return defaultValue;

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (err) {
    void err;
    return defaultValue;
  }
};

type AuthSessionPayload = {
  gat?: string;
  userId?: string;
  userType?: string;
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
  };
};

export const setAuthSession = (session: AuthSessionPayload): void => {
  if (session.gat || session.accessToken || session.refreshToken) {
    sessionCache.authenticated = true;
  }
  if (session.userId) sessionCache.userId = session.userId;
  if (session.userType) sessionCache.userType = session.userType;

  void persistSession(session);
};

export const setAuthToken = (token = ""): void => {
  setAuthSession({ gat: token });
};

export const resetAuthToken = (): void => {
  sessionCache.authenticated = false;
  void persistSession({ gat: "" });
};

/** @deprecated Auth tokens are httpOnly cookies; not readable client-side. */
export const getAuthToken = (): string | null => null;

const syncSessionFromServer = async (): Promise<SessionCache> => {
  if (!isBrowser()) return sessionCache;

  try {
    const response = await fetch(SESSION_API, { credentials: "include" });
    const data = (await response.json()) as {
      authenticated?: boolean;
      userId?: string;
      userType?: string;
    };

    sessionCache = {
      authenticated: Boolean(data.authenticated),
      userId: data.userId ?? null,
      userType: data.userType ?? null,
    };
  } catch {
    sessionCache = {
      authenticated: false,
      userId: null,
      userType: null,
    };
  }

  return sessionCache;
};

export const hydrateSession = (): Promise<SessionCache> =>
  syncSessionFromServer();

export const isLoggedIn = async (): Promise<boolean> => {
  const session = await syncSessionFromServer();
  return session.authenticated;
};

export const setAccessToken = (token = ""): void => {
  setAuthSession({ accessToken: token });
};

/** @deprecated Auth tokens are httpOnly cookies; not readable client-side. */
export const getAccessToken = (): string | null => null;

export const resetAccessToken = (): void => {
  void persistSession({ accessToken: "" });
};

export const setUserId = (userId = ""): void => {
  setAuthSession({ userId });
};

export const getUserId = (): string | null => sessionCache.userId;

export const resetUserId = (): void => {
  sessionCache.userId = null;
  void persistSession({ userId: "" });
};

export const setUserType = (userType = ""): void => {
  setAuthSession({ userType });
};

export const getUserType = (): string | null => sessionCache.userType;

export const resetUserType = (): void => {
  sessionCache.userType = null;
  void persistSession({ userType: "" });
};

export const setDistributionManagerId = (distributionManagerId = ""): void =>
  setKeyInStorage(distributionManagerIdStorageKey, distributionManagerId);
export const resetDistributionManagerId = (): void =>
  setDistributionManagerId();
export const getDistributionManagerId = (): string | null =>
  getKeyFromStorage<string | null>(distributionManagerIdStorageKey, null);

export const setDarkMode = (enabled = false): void =>
  setKeyInStorage(darkModeStorageKey, enabled);

/**
 * Return the stored dark-mode preference.
 * If the user has never explicitly chosen a theme, fall back to the OS/browser
 * system preference via `prefers-color-scheme`.
 */
export const getDarkMode = (): boolean => {
  if (!isBrowser()) return false;
  try {
    const raw = window.localStorage.getItem(darkModeStorageKey);
    if (raw !== null) {
      return JSON.parse(raw) as boolean;
    }
  } catch {
    // localStorage unavailable or corrupted — fall through to system pref.
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
};

export const setInvitedUserSessionId = (sessionId = ""): void =>
  setKeyInStorage(invitedUserSessionIdStorageKey, sessionId);
export const getInvitedUserSessionId = (): string | null =>
  getKeyFromStorage<string | null>(invitedUserSessionIdStorageKey, null);
export const resetInvitedUserSessionId = (): void => setInvitedUserSessionId();

export const logout = async (
  callback?: () => void | Promise<void>,
): Promise<void> => {
  if (isBrowser()) {
    await clearSession();
    resetInvitedUserSessionId();
  }
  if (callback) await callback();
  resetAuthUser();
  disableDarkMode();
};

export function applyAuthPayload(user: any, gat?: string): void {
  const userType = user?.type || user?.userType;

  if (gat || user?.id || userType) {
    setAuthSession({
      gat,
      userId: user?.id,
      userType,
    });
  }

  if (user?.id) {
    setAuthUser(user);
  }
}

export const getOrgNo = (): string | undefined => undefined;
export const getUserOrgNo = (): string | undefined => undefined;
export const getProjectNo = (): string | undefined => undefined;

export const AuthUtils = {
  getServerCode,
  getAuthToken,
  setAccessToken,
  resetAccessToken,
  getAccessToken,
  isLoggedIn,
  hydrateSession,
  logout,
  resetAuthToken,
  setAuthToken,
  setAuthSession,

  setUserId,
  getUserId,
  resetUserId,

  setUserType,
  getUserType,
  resetUserType,

  getDistributionManagerId,
  setDistributionManagerId,
  resetDistributionManagerId,
  setDarkMode,
  getDarkMode,

  setInvitedUserSessionId,
  getInvitedUserSessionId,
  resetInvitedUserSessionId,
  getOrgNo,
  getUserOrgNo,
  getProjectNo,
};

export default AuthUtils;
