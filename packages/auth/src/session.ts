import {
  authCookieNames,
  defaultCookieOptions,
  type AuthCookieConfig,
  type CookieOptions,
} from "./cookies";

type CookieStore = {
  get: (name: string) => { value: string } | undefined;
  set: (name: string, value: string, options?: CookieOptions) => void;
  delete: (name: string) => void;
};

export type SessionTokens = {
  accessToken?: string;
  refreshToken?: string;
};

export type AuthSessionData = SessionTokens & {
  gat?: string;
  userId?: string;
  userType?: string;
};

export type PublicSession = {
  authenticated: boolean;
  userId?: string;
  userType?: string;
};

export function getSessionTokens(
  cookieStore: CookieStore,
  config: AuthCookieConfig,
): SessionTokens {
  const names = authCookieNames(config.prefix);
  return {
    accessToken: cookieStore.get(names.accessToken)?.value,
    refreshToken: cookieStore.get(names.refreshToken)?.value,
  };
}

export function getAuthSession(
  cookieStore: CookieStore,
  config: AuthCookieConfig,
): AuthSessionData {
  const names = authCookieNames(config.prefix);
  const tokens = getSessionTokens(cookieStore, config);

  return {
    ...tokens,
    gat: cookieStore.get(names.gat)?.value,
    userId: cookieStore.get(names.userId)?.value,
    userType: cookieStore.get(names.userType)?.value,
  };
}

export function getPublicSession(
  cookieStore: CookieStore,
  config: AuthCookieConfig,
): PublicSession {
  const session = getAuthSession(cookieStore, config);
  const authenticated = Boolean(
    session.gat || session.accessToken || session.refreshToken,
  );

  return {
    authenticated,
    userId: session.userId,
    userType: session.userType,
  };
}

export function setAuthSession(
  cookieStore: CookieStore,
  config: AuthCookieConfig,
  session: AuthSessionData,
  options: CookieOptions = {},
) {
  const names = authCookieNames(config.prefix);
  const base = { ...defaultCookieOptions(config), ...options };

  if (session.gat) cookieStore.set(names.gat, session.gat, base);
  if (session.userId) cookieStore.set(names.userId, session.userId, base);
  if (session.userType) cookieStore.set(names.userType, session.userType, base);
  if (session.accessToken) {
    cookieStore.set(names.accessToken, session.accessToken, base);
  }
  if (session.refreshToken) {
    cookieStore.set(names.refreshToken, session.refreshToken, base);
  }
}

export function setSessionTokens(
  cookieStore: CookieStore,
  config: AuthCookieConfig,
  tokens: SessionTokens,
  options: CookieOptions = {},
) {
  setAuthSession(cookieStore, config, tokens, options);
}

export function clearAuthSession(
  cookieStore: CookieStore,
  config: AuthCookieConfig,
) {
  const names = authCookieNames(config.prefix);
  cookieStore.delete(names.accessToken);
  cookieStore.delete(names.refreshToken);
  cookieStore.delete(names.session);
  cookieStore.delete(names.gat);
  cookieStore.delete(names.userId);
  cookieStore.delete(names.userType);
}

export function clearSessionTokens(
  cookieStore: CookieStore,
  config: AuthCookieConfig,
) {
  clearAuthSession(cookieStore, config);
}
