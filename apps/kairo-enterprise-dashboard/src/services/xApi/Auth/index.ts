import { xApiBff } from "@/lib/bff/client";

const AUTH_BASE = "auth/access-control-flows";

export const xApiAuth = {
  login: (data: Record<string, unknown>) =>
    xApiBff.request("auth/login", {
      method: "POST",
      body: data,
    }),

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
