import { xApiBff } from "@/lib/bff/client";
import type {
  BackendChannel,
  BackendChannelConfig,
  BackendConversationType,
  BackendSettings,
  BackendSettingsSchema,
  BackendWhatsAppConnectRequest,
  BackendWhatsAppConnectResponse,
} from "./types";

// Unwraps the future { statusCode, data } envelope; falls back to the raw response
// for endpoints that currently return bare objects.
export function unwrapFlowResponse<T>(res: unknown): T {
  if (res && typeof res === "object" && "data" in res) {
    return (res as { data: T }).data;
  }
  return res as T;
}

const FLOW_BASE = (orgId: string) => `v1/orgs/${orgId}`;

export const flow = {
  getSchema: (orgId: string) =>
    xApiBff.request<BackendSettingsSchema>(
      `${FLOW_BASE(orgId)}/agents/flow/settings/schema`,
    ),

  getSettings: (orgId: string) =>
    xApiBff.request<BackendSettings>(
      `${FLOW_BASE(orgId)}/agents/flow/settings`,
    ),

  saveSettings: (orgId: string, body: Partial<BackendSettings>) =>
    xApiBff.request<BackendSettings>(
      `${FLOW_BASE(orgId)}/agents/flow/settings`,
      { method: "PUT", body },
    ),

  saveConversationType: (
    orgId: string,
    typeId: string,
    body: BackendConversationType,
  ) =>
    xApiBff.request<BackendConversationType>(
      `${FLOW_BASE(orgId)}/agents/flow/settings/conversations/${typeId}`,
      { method: "PUT", body },
    ),

  createCustomConversation: (orgId: string, name: string) =>
    xApiBff.request<{
      type: string;
      conversation: BackendConversationType;
    }>(`${FLOW_BASE(orgId)}/agents/flow/settings/conversations`, {
      method: "POST",
      body: { name },
    }),

  getChannels: (orgId: string) =>
    xApiBff.request<BackendChannel[]>(
      `${FLOW_BASE(orgId)}/flow/channels`,
    ),

  connectWhatsApp: (orgId: string, body: BackendWhatsAppConnectRequest) =>
    xApiBff.request<BackendWhatsAppConnectResponse>(
      `${FLOW_BASE(orgId)}/flow/channels/whatsapp`,
      { method: "PUT", body },
    ),

  getChannelConfig: (orgId: string, channel: string) =>
    xApiBff.request<BackendChannelConfig>(
      `${FLOW_BASE(orgId)}/flow/channels/${channel}/config`,
    ),

  saveBankingBackend: (
    orgId: string,
    body: { kind: string; url: string; headers: Record<string, string> },
  ) =>
    xApiBff.request(`${FLOW_BASE(orgId)}/flow/banking-backend`, {
      method: "PUT",
      body,
    }),
};
