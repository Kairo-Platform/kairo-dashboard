import { bffRequest, xApiBff } from "@/lib/bff/client";
import type { DashboardUsersPage } from "@/services/Analytics/types";

export interface UsersQuery {
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  timezone?: string;
}

export const users = {
  me: () => bffRequest("/api/user", "me", { method: "GET" }),
  getUsers: (orgId: string, query: UsersQuery) =>
    xApiBff.request<DashboardUsersPage>(
      `v1/orgs/${encodeURIComponent(orgId)}/users`,
      {
        query: Object.fromEntries(
          Object.entries(query).filter(
            ([, value]) => value !== undefined && value !== "",
          ),
        ),
      },
    ),
};
