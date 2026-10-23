import type { BackendButton, BackendButtonAction } from "@/services/Flow";
import { xApiBff } from "@/lib/bff/client";

export type BroadcastAudience =
  | "ALL"
  | "ACTIVE"
  | "BUSINESS_ACTIVATED"
  | "BUSINESS_NOT_ACTIVATED"
  | "INACTIVE"
  | "SUSPENDED"
  | "SELECTED"
  | "ALL_EXCEPT_SELECTED";
export interface BroadcastRequest {
  requestId: string;
  title: string;
  message: string;
  audience: BroadcastAudience;
  userIds: string[];
  buttons?: BackendButton[];
}
export interface BroadcastSummary {
  id: string;
  status: BroadcastStatus;
  title: string;
  audience: BroadcastAudience;
  createdAt: string;
  expiresAt: string;
  totalCount: number;
  counts: Record<
    "QUEUED" | "SENDING" | "SENT" | "UNKNOWN" | "EXPIRED" | "CANCELLED",
    number
  >;
}
export type RecipientStatus =
  | "QUEUED"
  | "SENDING"
  | "SENT"
  | "UNKNOWN"
  | "EXPIRED"
  | "CANCELLED";
export type BroadcastStatus = RecipientStatus | "PARTIAL";
export interface BroadcastQuery {
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}
export interface BroadcastPage<T> {
  items: T[];
  page: number;
  limit: number;
  totalCount: number;
}
export interface BroadcastSchema {
  buttonActions: BackendButtonAction[];
  maxReplyButtons: number;
  maxUrlButtons: number;
  maxButtonLabelLength: number;
  maxInteractiveTextLength: number;
}
export interface BroadcastDetails {
  broadcast: BroadcastSummary;
  message: string;
  buttons: BackendButton[];
}
export interface BroadcastRecipient {
  id: string;
  userId: string;
  displayName: string | null;
  channelUserId: string;
  status: RecipientStatus;
  reason: string | null;
  updatedAt: string;
}
const queryParams = (query: BroadcastQuery) =>
  Object.fromEntries(
    Object.entries(query).filter(
      ([, value]) => value !== undefined && value !== "",
    ),
  );
export const broadcasts = {
  schema: (orgId: string) => xApiBff.request<BroadcastSchema>(
    `v1/orgs/${encodeURIComponent(orgId)}/flow/broadcasts/schema`,
  ),
  list: (orgId: string, query: BroadcastQuery) =>
    xApiBff.request<BroadcastPage<BroadcastSummary>>(
      `v1/orgs/${encodeURIComponent(orgId)}/flow/broadcasts`,
      { query: queryParams(query) },
    ),
  details: (orgId: string, id: string) =>
    xApiBff.request<BroadcastDetails>(
      `v1/orgs/${encodeURIComponent(orgId)}/flow/broadcasts/${encodeURIComponent(id)}/details`,
    ),
  recipients: (orgId: string, id: string, query: BroadcastQuery) =>
    xApiBff.request<BroadcastPage<BroadcastRecipient>>(
      `v1/orgs/${encodeURIComponent(orgId)}/flow/broadcasts/${encodeURIComponent(id)}/recipients`,
      { query: queryParams(query) },
    ),
  create: (orgId: string, body: BroadcastRequest) =>
    xApiBff.request<BroadcastSummary>(
      `v1/orgs/${encodeURIComponent(orgId)}/flow/broadcasts`,
      { method: "POST", body },
    ),
  get: (orgId: string, id: string) =>
    xApiBff.request<BroadcastSummary>(
      `v1/orgs/${encodeURIComponent(orgId)}/flow/broadcasts/${encodeURIComponent(id)}`,
    ),
};
