import { entity } from "simpler-state";
import { showErrorNotification } from "@kairo/utils";
import { parseApiError } from "@/lib/utils/parseApiError";
import { hasApiError, unwrapApiData } from "@/lib/utils/apiResponse";
import { flow } from "@/services/Flow";
import { getOrgId } from "@/lib/auth/client";
import type {
  BackendChannel,
  BackendChannelConfig,
  BackendSettings,
  BackendSettingsSchema,
} from "@/services/Flow";

export interface FlowState {
  fetchingFlowSettings: boolean;
  flowSettings: BackendSettings | null;

  fetchingFlowSchema: boolean;
  flowSchema: BackendSettingsSchema | null;

  fetchingFlowChannels: boolean;
  flowChannels: BackendChannel[];

  fetchingFlowChannelConfig: boolean;
  flowChannelConfig: BackendChannelConfig | null;
}

const initialState: FlowState = {
  fetchingFlowSettings: false,
  flowSettings: null,

  fetchingFlowSchema: false,
  flowSchema: null,

  fetchingFlowChannels: false,
  flowChannels: [],

  fetchingFlowChannelConfig: false,
  flowChannelConfig: null,
};

export const flowStore = entity<FlowState>(initialState);

export const setFetchingFlowSettings = (payload = false): void => {
  void flowStore.set((s) => ({ ...s, fetchingFlowSettings: payload }));
};

export const setFlowSettings = (payload: BackendSettings | null = null): void => {
  void flowStore.set((s) => ({ ...s, flowSettings: payload }));
};

export const setFetchingFlowSchema = (payload = false): void => {
  void flowStore.set((s) => ({ ...s, fetchingFlowSchema: payload }));
};

export const setFlowSchema = (
  payload: BackendSettingsSchema | null = null,
): void => {
  void flowStore.set((s) => ({ ...s, flowSchema: payload }));
};

export const setFetchingFlowChannels = (payload = false): void => {
  void flowStore.set((s) => ({ ...s, fetchingFlowChannels: payload }));
};

export const setFlowChannels = (payload: BackendChannel[] = []): void => {
  void flowStore.set((s) => ({ ...s, flowChannels: payload }));
};

export const setFetchingFlowChannelConfig = (payload = false): void => {
  void flowStore.set((s) => ({ ...s, fetchingFlowChannelConfig: payload }));
};

export const setFlowChannelConfig = (
  payload: BackendChannelConfig | null = null,
): void => {
  void flowStore.set((s) => ({ ...s, flowChannelConfig: payload }));
};

export const resetFlowStore = (): void => {
  void flowStore.set(() => ({ ...initialState }));
};

export const fetchFlowSettings = async () => {
  const orgId = getOrgId();
  if (!orgId) return;

  setFetchingFlowSettings(true);
  try {
    const response = await flow.getSettings(orgId);
    if (hasApiError(response)) {
      throw response;
    }
    const data = unwrapApiData<BackendSettings>(response);
    if (data) setFlowSettings(data);
    return response;
  } catch (error) {
    showErrorNotification({
      message: parseApiError(error, "Failed to fetch Flow settings"),
    });
    throw error;
  } finally {
    setFetchingFlowSettings(false);
  }
};

export const fetchFlowSchema = async () => {
  const orgId = getOrgId();
  if (!orgId) return;

  setFetchingFlowSchema(true);
  try {
    const response = await flow.getSchema(orgId);
    if (hasApiError(response)) {
      throw response;
    }
    const data = unwrapApiData<BackendSettingsSchema>(response);
    if (data) setFlowSchema(data);
    return response;
  } catch (error) {
    showErrorNotification({
      message: parseApiError(error, "Failed to fetch Flow schema"),
    });
    throw error;
  } finally {
    setFetchingFlowSchema(false);
  }
};

export const fetchFlowChannels = async () => {
  const orgId = getOrgId();
  if (!orgId) return;

  setFetchingFlowChannels(true);
  try {
    const response = await flow.getChannels(orgId);
    if (hasApiError(response)) {
      throw response;
    }
    const data = unwrapApiData<BackendChannel[]>(response);
    if (Array.isArray(data)) setFlowChannels(data);
    return response;
  } catch (error) {
    showErrorNotification({
      message: parseApiError(error, "Failed to fetch Flow channels"),
    });
    throw error;
  } finally {
    setFetchingFlowChannels(false);
  }
};

export const fetchFlowChannelConfig = async (channel: string) => {
  const orgId = getOrgId();
  if (!orgId) return;

  setFetchingFlowChannelConfig(true);
  try {
    const response = await flow.getChannelConfig(orgId, channel);
    if (hasApiError(response)) {
      throw response;
    }
    const data = unwrapApiData<BackendChannelConfig>(response);
    if (data) setFlowChannelConfig(data);
    return response;
  } catch (error) {
    showErrorNotification({
      message: parseApiError(
        error,
        `Failed to fetch ${channel} channel config`,
      ),
    });
    throw error;
  } finally {
    setFetchingFlowChannelConfig(false);
  }
};
