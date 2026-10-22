import type { ConversationDetail } from "@/services/Analytics/types";
import { xApiBff } from "@/lib/bff/client";
import type {
  ConversationControl,
  AdminMessageRequest,
  AdminMessageResult,
  FlowConversationsQuery,
  FlowConversationsResponse,
  BackendBankingBackendState,
  BackendBankingBackendRequest,
  BackendBankingBackendResponse,
  BackendChannel,
  BackendChannelConfig,
  BackendConversationType,
  BackendSettings,
  SettingsUpdate,
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

const conversationPath = (orgId: string, userId: string) =>
  `${FLOW_BASE(orgId)}/flow/conversations/${encodeURIComponent(userId)}`;
export const flow = {
  getConversationControl: (orgId: string, userId: string) =>
    xApiBff.request<ConversationControl>(
      `${conversationPath(orgId, userId)}/control`,
    ),
  takeOverConversation: (orgId: string, userId: string) =>
    xApiBff.request<ConversationControl>(
      `${conversationPath(orgId, userId)}/takeover`,
      { method: "POST" },
    ),
  returnConversationToAgent: (
    orgId: string,
    userId: string,
    takeoverId: string,
  ) =>
    xApiBff.request<ConversationControl>(
      `${conversationPath(orgId, userId)}/return-to-agent`,
      { method: "POST", body: { takeoverId } },
    ),
  sendAdminMessage: (
    orgId: string,
    userId: string,
    body: AdminMessageRequest,
  ) =>
    xApiBff.request<AdminMessageResult>(
      `${conversationPath(orgId, userId)}/messages`,
      { method: "POST", body },
    ),
  getConversations: (orgId: string, query: FlowConversationsQuery) =>
    xApiBff.request<FlowConversationsResponse>(
      `${FLOW_BASE(orgId)}/conversations`,
      {
        query: Object.fromEntries(
          Object.entries(query).filter(
            ([, value]) => value !== undefined && value !== "",
          ),
        ),
      },
    ),

  getConversation: (
    orgId: string,
    userId: string,
    query: FlowConversationsQuery,
  ) =>
    xApiBff.request<ConversationDetail>(
      `${FLOW_BASE(orgId)}/conversations/${encodeURIComponent(userId)}`,
      {
        query: Object.fromEntries(
          Object.entries(query).filter(
            ([, value]) => value !== undefined && value !== "",
          ),
        ),
      },
    ),

  getSchema: (orgId: string) =>
    xApiBff.request<BackendSettingsSchema>(
      `${FLOW_BASE(orgId)}/agents/flow/settings/schema`,
    ),

  getSettings: (orgId: string) =>
    xApiBff.request<BackendSettings>(
      `${FLOW_BASE(orgId)}/agents/flow/settings`,
    ),

  saveSettings: (orgId: string, body: SettingsUpdate<BackendSettings>) =>
    xApiBff.request<BackendSettings>(
      `${FLOW_BASE(orgId)}/agents/flow/settings`,
      { method: "PATCH", body },
    ),

  saveConversationType: (
    orgId: string,
    typeId: string,
    body: BackendConversationType,
  ) =>
    xApiBff.request<BackendSettings>(
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
    xApiBff.request<BackendChannel[]>(`${FLOW_BASE(orgId)}/flow/channels`),

  getVariables: (orgId: string) =>
    xApiBff.request<BackendChannel[]>(
      `${FLOW_BASE(orgId)}/agents/flow/settings/variables`,
    ),

  getTriggerConditions: (orgId: string) =>
    xApiBff.request<BackendChannel[]>(
      `${FLOW_BASE(orgId)}/agents/flow/settings/conditions`,
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

  getBankingBackend: (orgId: string) =>
    xApiBff.request<BackendBankingBackendState>(
      `${FLOW_BASE(orgId)}/flow/banking-backend`,
    ),

  saveBankingBackend: (orgId: string, body: BackendBankingBackendRequest) =>
    xApiBff.request<BackendBankingBackendResponse>(
      `${FLOW_BASE(orgId)}/flow/banking-backend`,
      {
        method: "PUT",
        body,
      },
    ),
};
