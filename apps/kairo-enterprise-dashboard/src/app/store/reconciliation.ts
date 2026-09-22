import { entity } from "simpler-state";
import { showErrorNotification } from "@kairo/utils";
import { parseApiError } from "@/lib/utils/parseApiError";
import { hasApiError, unwrapApiData } from "@/lib/utils/apiResponse";
import { reconciliation } from "@/services/Reconciliation";
import { organization } from "@/services/Organization";
import { getOrgId } from "@/lib/auth/client";
import type { OrganizationApiKey } from "@/services/Organization";
import type {
  ReconciliationResult,
  ReconciliationRunResponse,
} from "@/services/Reconciliation";

export type ReconciliationState = {
  running: boolean;
  fetchingResult: boolean;
  run: ReconciliationRunResponse | null;
  status: string;
  result: ReconciliationResult | null;
  fetchingApiKeys: boolean;
  creatingApiKey: boolean;
  apiKeys: OrganizationApiKey[];
  question: { questionId: string; message: string } | null;
};

const initialState: ReconciliationState = {
  running: false,
  fetchingResult: false,
  run: null,
  status: "idle",
  result: null,
  fetchingApiKeys: false,
  creatingApiKey: false,
  apiKeys: [],
  question: null,
};

export const reconciliationStore = entity<ReconciliationState>(initialState);

const updateStore = (payload: Partial<ReconciliationState>) => {
  void reconciliationStore.set((state) => ({ ...state, ...payload }));
};

export const setReconciliationStatus = (status: string) =>
  updateStore({ status });

export const clearReconciliationQuestion = () =>
  updateStore({ question: null });

export const fetchOrganizationApiKeys = async () => {
  const orgId = getOrgId();
  if (!orgId) return [];
  updateStore({ fetchingApiKeys: true });
  try {
    const response = await organization.getApiKeys(orgId);
    if (hasApiError(response)) throw response;
    const data = unwrapApiData<OrganizationApiKey[]>(response);
    const apiKeys = Array.isArray(data) ? data : [];
    updateStore({ apiKeys });
    return apiKeys;
  } catch (error) {
    showErrorNotification({
      message: parseApiError(error, "Failed to fetch API keys"),
    });
    throw error;
  } finally {
    updateStore({ fetchingApiKeys: false });
  }
};

export const createOrganizationApiKey = async (name: string) => {
  const orgId = getOrgId();
  if (!orgId) throw new Error("Organization not found");
  updateStore({ creatingApiKey: true });
  try {
    const response = await organization.createApiKey(orgId, { name });
    if (hasApiError(response)) throw response;
    const apiKey = unwrapApiData<OrganizationApiKey>(response);
    updateStore({ apiKeys: [...reconciliationStore.get().apiKeys, apiKey] });
    return apiKey;
  } catch (error) {
    showErrorNotification({
      message: parseApiError(error, "Failed to generate API key"),
    });
    throw error;
  } finally {
    updateStore({ creatingApiKey: false });
  }
};

export const runReconciliation = async (files: File[], apiKey: string) => {
  updateStore({ running: true, run: null, result: null, status: "uploading" });
  try {
    const response = await reconciliation.run(files, apiKey);
    if (hasApiError(response)) throw response;
    const run = unwrapApiData<ReconciliationRunResponse>(response);
    updateStore({ run, status: "created" });
    return run;
  } catch (error) {
    updateStore({ status: "failed" });
    showErrorNotification({
      message: parseApiError(error, "Failed to start reconciliation"),
    });
    throw error;
  } finally {
    updateStore({ running: false });
  }
};

export const fetchReconciliationResult = async (
  runId: string,
  apiKey: string,
  silent = false,
) => {
  updateStore({ fetchingResult: !silent });
  try {
    const response = await reconciliation.getResult(runId, apiKey);
    if (hasApiError(response)) throw response;
    const result = unwrapApiData<ReconciliationResult | { status: string }>(
      response,
    );
    if ("status" in result && result.status) {
      setReconciliationStatus(result.status);
      return result;
    }
    if ("discrepancies" in result && result.discrepancies) {
      updateStore({ result, status: "completed" });
    }
    return result;
  } catch (error) {
    if (!silent) {
      showErrorNotification({
        message: parseApiError(error, "Failed to fetch reconciliation result"),
      });
    }
    throw error;
  } finally {
    updateStore({ fetchingResult: false });
  }
};

export const applyReconciliationSessionMessage = (message: unknown) => {
  if (!message || typeof message !== "object") return;
  const event = message as {
    type?: string;
    phase?: string;
    message?: string;
    report?: Partial<ReconciliationResult>;
    questionId?: string;
  };
  if (event.type === "progress") {
    setReconciliationStatus(event.message || event.phase || "processing");
    return;
  }
  if (event.type === "question") {
    if (event.questionId && event.message) {
      updateStore({
        status: "awaiting response",
        question: { questionId: event.questionId, message: event.message },
      });
    }
    return;
  }
  if (event.type === "report" && event.report) {
    updateStore({
      result: {
        summary: event.report.summary ?? "",
        inSync: event.report.inSync ?? false,
        matchedValue: event.report.matchedValue ?? "₦0.00",
        matchedGroups: event.report.matchedGroups ?? 0,
        actionRequiredCount: event.report.actionRequiredCount ?? 0,
        informationalCount: event.report.informationalCount ?? 0,
        unreadableRows: event.report.unreadableRows ?? 0,
        discrepancies: event.report.discrepancies ?? [],
      },
      status: "completed",
      question: null,
    });
    return;
  }

  const data = message as Partial<ReconciliationResult> & { status?: string };
  if (data.status) setReconciliationStatus(data.status);
  if (Array.isArray(data.discrepancies)) {
    updateStore({ result: data as ReconciliationResult, status: "completed" });
  }
};

export const resetReconciliation = () => {
  void reconciliationStore.set(() => ({ ...initialState }));
};
