import { xApiBff } from "@/lib/bff/client";

const AUTH_BASE = "auth/access-control-flows";
const GOOGLE_OAUTH_START_PATH = "/api/auth/oauth/google";

export const xApiAuth = {
  login: (data: Record<string, unknown>) =>
    xApiBff.request("auth/login", {
      method: "POST",
      body: data,
    }),

  signup: (data: {
    name: string;
    orgName: string;
    email: string;
    password: string;
  }) =>
    xApiBff.request("v1/auth/signup", {
      method: "POST",
      body: data,
    }),

  /**
   * Resolves the Google OAuth start URL from the app API route, then redirects.
   * Throws on configuration / network / API errors so callers can manage loading + errors.
   */
  startGoogleOAuth: async (): Promise<void> => {
    const response = await fetch(GOOGLE_OAUTH_START_PATH, {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
    });

    let payload: { redirectUrl?: string; message?: string; statusCode?: number } =
      {};

    try {
      payload = (await response.json()) as typeof payload;
    } catch {
      // non-JSON body
    }

    if (!response.ok) {
      const error = new Error(
        payload.message || "Failed to start Google sign-in",
      );
      (error as Error & { status?: number; body?: unknown }).status =
        response.status;
      (error as Error & { status?: number; body?: unknown }).body = payload;
      throw error;
    }

    if (!payload.redirectUrl) {
      throw new Error("Google sign-in URL was not returned");
    }

    window.location.assign(payload.redirectUrl);
  },

  initiateLogin: (data: Record<string, unknown>) =>
    xApiBff.request(`${AUTH_BASE}/initiate`, {
      method: "POST",
      body: data,
    }),

  processFlowStage: ({
    sessionId,
    data,
  }: {
    sessionId: string;
    data: unknown;
  }) =>
    xApiBff.request(`${AUTH_BASE}/${sessionId}/stages`, {
      method: "POST",
      body: data,
    }),

  retrieveCurrentFlowSession: ({ sessionId }: { sessionId: string }) =>
    xApiBff.request(`${AUTH_BASE}/${sessionId}`, {
      method: "GET",
    }),

  resendVerificationCode: ({ sessionId }: { sessionId: string }) =>
    xApiBff.request(`${AUTH_BASE}/${sessionId}/resend-otp`, {
      method: "POST",
    }),

  navigateFlowStage: ({
    sessionId,
    data,
  }: {
    sessionId: string;
    data: { targetStage: string };
  }) =>
    xApiBff.request(`${AUTH_BASE}/${sessionId}/navigate`, {
      method: "POST",
      body: data,
    }),
};

export const auth = xApiAuth;
