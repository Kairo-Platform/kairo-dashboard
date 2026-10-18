import { entity } from "simpler-state";
import { showErrorNotification } from "@kairo/utils";
import { getOrgId, hydrateSession } from "@/lib/auth/client";
import { hasApiError, unwrapApiData } from "@/lib/utils/apiResponse";
import { parseApiError } from "@/lib/utils/parseApiError";
import { analytics, type AnalyticsQuery } from "@/services/Analytics";
import type { DashboardAnalytics } from "@/services/Analytics/types";

export interface AnalyticsState {
  analytics: DashboardAnalytics | null;
  fetchingAnalytics: boolean;
  queryKey: string | null;
  orgId: string | null;
}

const initialState: AnalyticsState = {
  analytics: null,
  fetchingAnalytics: false,
  queryKey: null,
  orgId: null,
};
export const analyticsStore = entity<AnalyticsState>(initialState);
let latestRequest = 0;

export const fetchAnalytics = async (filters: AnalyticsQuery) => {
  const request = ++latestRequest;
  let orgId = getOrgId();
  void analyticsStore.set({
    ...initialState,
    fetchingAnalytics: true,
    queryKey: JSON.stringify(filters),
    orgId,
  });
  try {
    orgId = orgId ?? (await hydrateSession()).orgId;
    if (request !== latestRequest) return;
    if (!orgId)
      throw new Error("Please sign in to an organization to view this data.");
    const response = await analytics.getAnalytics(orgId, filters);
    if (hasApiError(response)) throw response;
    if (request === latestRequest && getOrgId() === orgId) {
      void analyticsStore.set((s) => ({
        ...s,
        analytics: unwrapApiData<DashboardAnalytics>(response),
        orgId,
      }));
    }
    return response;
  } catch (error) {
    if (request === latestRequest && getOrgId() === orgId) {
      void analyticsStore.set((s) => ({ ...s, orgId }));
      showErrorNotification({
        message: parseApiError(
          error,
          "Unable to load analytics. Please try again.",
        ),
      });
    }
    throw error;
  } finally {
    if (request === latestRequest) {
      void analyticsStore.set((s) => ({ ...s, fetchingAnalytics: false }));
    }
  }
};

export const resetAnalyticsStore = (): void => {
  latestRequest++;
  void analyticsStore.set({ ...initialState });
};
