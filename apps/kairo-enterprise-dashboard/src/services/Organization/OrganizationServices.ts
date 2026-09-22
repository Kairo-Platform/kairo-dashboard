import { xApiBff } from "@/lib/bff/client";
import type {
  CreateOrganizationApiKeyRequest,
  OrganizationApiKey,
} from "./types";

const API_KEYS_PATH = (orgId: string) =>
  `v1/orgs/${encodeURIComponent(orgId)}/api-keys`;

export const organization = {
  getApiKeys: (orgId: string) =>
    xApiBff.request<OrganizationApiKey[]>(API_KEYS_PATH(orgId)),

  createApiKey: (orgId: string, body: CreateOrganizationApiKeyRequest) =>
    xApiBff.request<OrganizationApiKey>(API_KEYS_PATH(orgId), {
      method: "POST",
      body,
    }),
};
