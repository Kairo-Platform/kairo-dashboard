import { URL } from "@/lib/constants/URL";

export const OAUTH_CALLBACK_STATUS = {
  SUCCESS: "success",
  DENIED: "denied",
  ERROR: "error",
} as const;

export type OAuthCallbackStatus =
  (typeof OAUTH_CALLBACK_STATUS)[keyof typeof OAUTH_CALLBACK_STATUS];

const OAUTH_STATUS_MESSAGES: Record<OAuthCallbackStatus, string> = {
  [OAUTH_CALLBACK_STATUS.SUCCESS]: "Signed in successfully.",
  [OAUTH_CALLBACK_STATUS.DENIED]: "Google sign-in was cancelled or denied.",
  [OAUTH_CALLBACK_STATUS.ERROR]: "Google sign-in failed. Try again.",
};

const OAUTH_RETURN_TO_KEY = "kairo_oauth_return_to";

const ALLOWED_OAUTH_RETURN_PATHS = new Set<string>([
  URL.LOGIN_URL,
  URL.SIGNUP_URL,
]);

export function setOAuthReturnTo(path: string): void {
  if (typeof window === "undefined") return;
  if (!ALLOWED_OAUTH_RETURN_PATHS.has(path)) return;
  window.sessionStorage.setItem(OAUTH_RETURN_TO_KEY, path);
}

export function consumeOAuthReturnTo(fallback = URL.LOGIN_URL): string {
  if (typeof window === "undefined") return fallback;

  const stored = window.sessionStorage.getItem(OAUTH_RETURN_TO_KEY);
  window.sessionStorage.removeItem(OAUTH_RETURN_TO_KEY);

  if (stored && ALLOWED_OAUTH_RETURN_PATHS.has(stored)) {
    return stored;
  }

  return fallback;
}

/** Returns the status if it matches an agreed value; otherwise null. */
export function parseOAuthCallbackStatus(
  status: string | null | undefined,
): OAuthCallbackStatus | null {
  if (
    status === OAUTH_CALLBACK_STATUS.SUCCESS ||
    status === OAUTH_CALLBACK_STATUS.DENIED ||
    status === OAUTH_CALLBACK_STATUS.ERROR
  ) {
    return status;
  }

  return null;
}

export function getOAuthStatusMessage(
  status: OAuthCallbackStatus | string | null | undefined,
): string {
  const parsed =
    typeof status === "string"
      ? parseOAuthCallbackStatus(status)
      : (status ?? null);

  if (!parsed) {
    return OAUTH_STATUS_MESSAGES[OAUTH_CALLBACK_STATUS.ERROR];
  }

  return OAUTH_STATUS_MESSAGES[parsed];
}
