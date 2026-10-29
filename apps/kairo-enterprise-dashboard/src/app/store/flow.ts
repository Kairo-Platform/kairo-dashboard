import { entity } from "simpler-state";
import { showErrorNotification } from "@kairo/utils";
import { parseApiError } from "@/lib/utils/parseApiError";
import { hasApiError, unwrapApiData } from "@/lib/utils/apiResponse";
import { flow } from "@/services/Flow";
import type { ConversationDetail } from "@/services/Analytics/types";
import { getOrgId, hydrateSession } from "@/lib/auth/client";
import type {
  FlowKnowledgeBase,
  FlowKnowledgeNote,
  FlowConversationsQuery,
  FlowConversationsResponse,
  BackendChannel,
  BackendChannelConfig,
  BackendSettings,
  SettingsUpdate,
  BackendSettingsSchema,
  FlowMessageVariables,
  FlowTriggerCondition,
} from "@/services/Flow";

export interface FlowState {
  conversationsQueryKey: string | null;
  conversationsOrgId: string | null;
  conversationDetail: ConversationDetail | null;
  fetchingConversationDetail: boolean;
  conversationDetailQueryKey: string | null;
  conversationDetailOrgId: string | null;

  fetchingFlowConversations: boolean;
  flowConversations: FlowConversationsResponse | null;

  fetchingFlowSettings: boolean;
  flowSettings: BackendSettings | null;

  fetchingFlowSchema: boolean;
  flowSchema: BackendSettingsSchema | null;

  fetchingFlowChannels: boolean;
  flowChannels: BackendChannel[];

  fetchingFlowChannelConfig: boolean;
  flowChannelConfig: BackendChannelConfig | null;

  fetchingFlowVariables: boolean;
  flowVariables: FlowMessageVariables[] | null;

  fetchingFlowTriggerConditions: boolean;
  flowTriggerConditions: FlowTriggerCondition[] | null;
}

const initialState: FlowState = {
  conversationsQueryKey: null,
  conversationsOrgId: null,
  conversationDetail: null,
  fetchingConversationDetail: false,
  conversationDetailQueryKey: null,
  conversationDetailOrgId: null,

  fetchingFlowConversations: false,
  flowConversations: null,

  fetchingFlowSettings: false,
  flowSettings: null,

  fetchingFlowSchema: false,
  flowSchema: null,

  fetchingFlowChannels: false,
  flowChannels: [],

  fetchingFlowChannelConfig: false,
  flowChannelConfig: null,

  fetchingFlowVariables: false,
  flowVariables: null,

  fetchingFlowTriggerConditions: false,
  flowTriggerConditions: null,
};

export const flowStore = entity<FlowState>(initialState);

export const setFetchingFlowSettings = (payload = false): void => {
  void flowStore.set((s) => ({ ...s, fetchingFlowSettings: payload }));
};

export const setFlowSettings = (
  payload: BackendSettings | null = null,
): void => {
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

export const setFetchingFlowVariables = (payload = false): void => {
  void flowStore.set((s) => ({ ...s, fetchingFlowVariables: payload }));
};

export const setFlowVariables = (
  payload: FlowMessageVariables[] | null = null,
): void => {
  void flowStore.set((s) => ({ ...s, flowVariables: payload }));
};

export const setFetchingFlowTriggerConditions = (payload = false): void => {
  void flowStore.set((s) => ({ ...s, fetchingFlowTriggerConditions: payload }));
};

export const setFlowTriggerConditions = (
  payload: FlowTriggerCondition[] | null = null,
): void => {
  void flowStore.set((s) => ({ ...s, flowTriggerConditions: payload }));
};

export const setFetchingFlowConversations = (payload = false): void => {
  void flowStore.set((s) => ({ ...s, fetchingFlowConversations: payload }));
};

export const setFlowConversations = (
  payload: FlowConversationsResponse | null = null,
): void => {
  void flowStore.set((s) => ({ ...s, flowConversations: payload }));
};

let conversationsRequest = 0;
let conversationDetailRequest = 0;

export const fetchFlowConversations = async (
  filters: FlowConversationsQuery,
) => {
  const request = ++conversationsRequest;
  let orgId = getOrgId();
  void flowStore.set((s) => ({
    ...s,
    flowConversations: null,
    fetchingFlowConversations: true,
    conversationsQueryKey: JSON.stringify(filters),
    conversationsOrgId: orgId,
  }));
  try {
    orgId = orgId ?? (await hydrateSession()).orgId;
    if (request !== conversationsRequest) return;
    if (!orgId)
      throw new Error("Please sign in to an organization to view this data.");
    const response = await flow.getConversations(orgId, filters);
    if (hasApiError(response)) throw response;
    if (request === conversationsRequest && getOrgId() === orgId) {
      void flowStore.set((s) => ({
        ...s,
        flowConversations: unwrapApiData<FlowConversationsResponse>(response),
        conversationsOrgId: orgId,
      }));
    }
    return response;
  } catch (error) {
    if (request === conversationsRequest && getOrgId() === orgId) {
      void flowStore.set((s) => ({ ...s, conversationsOrgId: orgId }));
      showErrorNotification({
        message: parseApiError(
          error,
          "Unable to load conversations. Please try again.",
        ),
      });
    }
    throw error;
  } finally {
    if (request === conversationsRequest)
      void flowStore.set((s) => ({ ...s, fetchingFlowConversations: false }));
  }
};

export const fetchConversationDetail = async (
  userId: string,
  filters: FlowConversationsQuery,
  silent = false,
) => {
  const request = ++conversationDetailRequest;
  let orgId = getOrgId();
  void flowStore.set((s) => ({
    ...s,
    conversationDetail:
      silent &&
      s.conversationDetailOrgId === orgId &&
      s.conversationDetailQueryKey === JSON.stringify([userId, filters])
        ? s.conversationDetail
        : null,
    fetchingConversationDetail: !silent,
    conversationDetailQueryKey: JSON.stringify([userId, filters]),
    conversationDetailOrgId: orgId,
  }));
  try {
    orgId = orgId ?? (await hydrateSession()).orgId;
    if (request !== conversationDetailRequest) return;
    if (!orgId)
      throw new Error("Please sign in to an organization to view this data.");
    const response = await flow.getConversation(orgId, userId, filters);
    if (hasApiError(response)) throw response;
    if (request === conversationDetailRequest && getOrgId() === orgId) {
      void flowStore.set((s) => ({
        ...s,
        conversationDetail: unwrapApiData<ConversationDetail>(response),
        conversationDetailOrgId: orgId,
      }));
    }
    return response;
  } catch (error) {
    if (request === conversationDetailRequest && getOrgId() === orgId) {
      void flowStore.set((s) => ({ ...s, conversationDetailOrgId: orgId }));
      if (!silent)
        showErrorNotification({
          message: parseApiError(
            error,
            "Unable to load conversations. Please try again.",
          ),
        });
    }
    throw error;
  } finally {
    if (request === conversationDetailRequest)
      void flowStore.set((s) => ({ ...s, fetchingConversationDetail: false }));
  }
};

export const resetFlowStore = (): void => {
  conversationsRequest++;
  conversationDetailRequest++;
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

export const fetchFlowVariables = async () => {
  const orgId = getOrgId();
  if (!orgId) return;

  setFetchingFlowVariables(true);
  try {
    const response = await flow.getVariables(orgId);
    if (hasApiError(response)) {
      throw response;
    }
    const data = unwrapApiData<FlowMessageVariables[]>(response);
    if (Array.isArray(data)) setFlowVariables(data);
    return response;
  } catch (error) {
    showErrorNotification({
      message: parseApiError(error, "Failed to fetch Flow variables"),
    });
    throw error;
  } finally {
    setFetchingFlowVariables(false);
  }
};

export const fetchFlowTriggerConditions = async () => {
  const orgId = getOrgId();
  if (!orgId) return;

  setFetchingFlowTriggerConditions(true);
  try {
    const response = await flow.getTriggerConditions(orgId);
    if (hasApiError(response)) {
      throw response;
    }
    const data = unwrapApiData<FlowTriggerCondition[]>(response);
    if (Array.isArray(data)) setFlowTriggerConditions(data);
    return response;
  } catch (error) {
    showErrorNotification({
      message: parseApiError(error, "Failed to fetch Flow trigger conditions"),
    });
    throw error;
  } finally {
    setFetchingFlowTriggerConditions(false);
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

export const saveFlowSettings = async (
  changes: SettingsUpdate<BackendSettings>,
) => {
  const orgId = getOrgId();
  if (!orgId) throw new Error("Organization not found");
  const response = await flow.saveSettings(orgId, changes);
  if (hasApiError(response)) throw response;
  const settings = unwrapApiData<BackendSettings>(response);
  if (!settings?.general || !settings?.conversations) {
    throw new Error(
      "The settings response was incomplete. Please reload and check your changes.",
    );
  }
  if (getOrgId() === orgId) setFlowSettings(settings);
  return settings;
};

// Knowledge mutations update only this section, preserving other settings in the store.
const mutateFlowKnowledge = async (
  request: (orgId: string) => Promise<FlowKnowledgeBase>,
) => {
  const orgId = getOrgId();
  if (!orgId) throw new Error("Organization not found");
  const response = await request(orgId);
  if (hasApiError(response)) throw response;
  const knowledge = unwrapApiData<FlowKnowledgeBase>(response);
  if (!Array.isArray(knowledge?.items)) {
    throw new Error(
      "The knowledge response was incomplete. Please reload and check your changes.",
    );
  }
  if (getOrgId() === orgId) {
    flowStore.set((state) => ({
      ...state,
      flowSettings: state.flowSettings
        ? {
            ...state.flowSettings,
            general: {
              ...state.flowSettings.general,
              knowledgeBase: knowledge,
            },
          }
        : null,
    }));
  }
  return knowledge;
};

export const addFlowKnowledgeNote = (note: FlowKnowledgeNote) =>
  mutateFlowKnowledge((orgId) => flow.addKnowledgeNote(orgId, note));
export const editFlowKnowledgeNote = (
  itemId: string,
  note: FlowKnowledgeNote,
) =>
  mutateFlowKnowledge((orgId) => flow.editKnowledgeNote(orgId, itemId, note));
export const uploadFlowKnowledgeFile = (file: File) =>
  mutateFlowKnowledge((orgId) => flow.uploadKnowledgeFile(orgId, file));
export const deleteFlowKnowledge = (itemId: string) =>
  mutateFlowKnowledge((orgId) => flow.deleteKnowledge(orgId, itemId));
