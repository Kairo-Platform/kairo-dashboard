import { xApiBff } from "@/lib/bff/client";

export type BroadcastAudience =
  | "ALL"
  | "ACTIVE"
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
}
export interface BroadcastSummary {
  id: string;
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
export const broadcasts = {
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
