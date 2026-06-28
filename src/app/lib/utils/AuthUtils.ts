import { isBrowser } from "@/app/lib/utils";
import { resetAuthUser, disableDarkMode } from "@/app/store/auth";
import { SERVER_CODE } from "@/app/lib/shared-constants";

const gatStorageKey = "kr_gat";
const accessTokenStorageKey = "kr_access_token";
const distributionManagerIdStorageKey = "kr_dm_id";
const userIdStorageKey = "kr_user_id";
const darkModeStorageKey = "kr_dark_mode";
const invitedUserSessionIdStorageKey = "kr_invited_user_session_id";

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

export const setAuthToken = (token = ""): void =>
  setKeyInStorage(gatStorageKey, token);
export const resetAuthToken = (): void => setAuthToken();
export const getAuthToken = (): string | null =>
  getKeyFromStorage<string | null>(gatStorageKey, null);
export const isLoggedIn = (): boolean => Boolean(getAuthToken());

export const setAccessToken = (token = ""): void =>
  setKeyInStorage(accessTokenStorageKey, token);
export const getAccessToken = (): string | null =>
  getKeyFromStorage<string | null>(accessTokenStorageKey, null);
export const resetAccessToken = (): void => setAccessToken();

export const setUserId = (userId = ""): void =>
  setKeyInStorage(userIdStorageKey, userId);
export const getUserId = (): string | null =>
  getKeyFromStorage<string | null>(userIdStorageKey, null);
export const resetUserId = (): void => setUserId();

export const setUserType = (userType = ""): void =>
  setKeyInStorage("userType", userType);
export const getUserType = (): string | null =>
  getKeyFromStorage<string | null>("userType", null);
export const resetUserType = (): void => setUserType();

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
      // Preference was explicitly stored — honour it.
      return JSON.parse(raw) as boolean;
    }
  } catch {
    // localStorage unavailable or corrupted — fall through to system pref.
  }
  // No explicit preference: use the OS/browser setting.
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
    resetAuthToken();
    resetUserId();
    resetInvitedUserSessionId();
    resetUserType();
  }
  if (callback) await callback();
  resetAuthUser();
  disableDarkMode();
};

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
  logout,
  resetAuthToken,
  setAuthToken,

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
  // unused extras - added to complete AuthUtils interface
  getOrgNo,
  getUserOrgNo,
  getProjectNo,
};

export default AuthUtils;
