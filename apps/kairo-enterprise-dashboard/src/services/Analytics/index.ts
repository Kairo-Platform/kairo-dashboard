import { xApiBff } from "@/lib/bff/client";
import type {
  AgentFilter,
  DashboardAnalytics,
} from "@/services/Analytics/types";

export interface AnalyticsQuery {
  agent?: AgentFilter;
  startDate?: string;
  endDate?: string;
  timezone?: string;
}

export const analytics = {
  getAnalytics: (orgId: string, query: AnalyticsQuery) =>
    xApiBff.request<DashboardAnalytics>(
      `v1/orgs/${encodeURIComponent(orgId)}/analytics`,
      {
        query: Object.fromEntries(
          Object.entries(query).filter(
            ([, value]) => value !== undefined && value !== "",
          ),
        ),
      },
    ),
};
