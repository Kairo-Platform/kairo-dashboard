import { entity } from "simpler-state";
import { getOrgId } from "@/lib/auth/client";
import { hasApiError, unwrapApiData } from "@/lib/utils/apiResponse";
import { parseApiError } from "@/lib/utils/parseApiError";
import { showErrorNotification } from "@kairo/utils";
import { instagramApp } from "@/services/InstagramApp";
import type {
  BackendChannelConfig,
  ChannelConnectRequest,
} from "@/services/Flow";

export const instagramAppStore = entity<{
  fetchingConfig: boolean;
  config: BackendChannelConfig | null;
  configOrgId: string | null;
}>({ fetchingConfig: false, config: null, configOrgId: null });
let generation = 0;

export function resetInstagramApp() {
  generation++;
  instagramAppStore.set({
    fetchingConfig: false,
    config: null,
    configOrgId: null,
  });
}

export async function fetchInstagramApp() {
  const request = ++generation;
  const orgId = getOrgId();
  instagramAppStore.set({
    fetchingConfig: true,
    config: null,
    configOrgId: null,
  });
  try {
    if (!orgId) throw new Error("Please sign in again.");
    const response = await instagramApp.getConfig(orgId);
    if (hasApiError(response)) throw response;
    if (request !== generation || getOrgId() !== orgId) return null;
    const config = unwrapApiData<BackendChannelConfig>(response);
    if (config.schema?.version !== 1 || !Array.isArray(config.schema.fields))
      throw new Error("Instagram app settings are unavailable.");
    instagramAppStore.set({
      fetchingConfig: false,
      config,
      configOrgId: orgId,
    });
    return config;
  } catch (error) {
    if (request === generation && getOrgId() === orgId)
      showErrorNotification({
        message: parseApiError(error, "Unable to load Instagram app settings."),
      });
    return null;
  } finally {
    if (request === generation)
      instagramAppStore.set((state) => ({ ...state, fetchingConfig: false }));
  }
}

export async function saveInstagramApp(body: ChannelConnectRequest) {
  const orgId = getOrgId();
  if (!orgId) throw new Error("Please sign in again.");
  if (instagramAppStore.get().configOrgId !== orgId)
    throw new Error("Organization changed. Reopen app settings.");
  const request = generation;
  const response = await instagramApp.saveConfig(orgId, body);
  if (hasApiError(response)) throw response;
  if (orgId !== getOrgId() || request !== generation)
    throw new Error("Organization changed. Reopen app settings.");
  const config = unwrapApiData<BackendChannelConfig>(response);
  instagramAppStore.set((state) => ({ ...state, config }));
  return config;
}
