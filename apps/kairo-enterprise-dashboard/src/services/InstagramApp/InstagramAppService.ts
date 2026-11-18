import { xApiBff } from "@/lib/bff/client";
import type {
  BackendChannelConfig,
  ChannelConnectRequest,
} from "@/services/Flow";

const path = (orgId: string) =>
  `v1/orgs/${orgId}/flow/integrations/instagram/config`;

export const instagramApp = {
  getConfig: (orgId: string) =>
    xApiBff.request<BackendChannelConfig>(path(orgId)),
  saveConfig: (orgId: string, body: ChannelConnectRequest) =>
    xApiBff.request<BackendChannelConfig>(path(orgId), { method: "PUT", body }),
};
