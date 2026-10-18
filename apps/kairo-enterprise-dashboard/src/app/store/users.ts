import { entity } from "simpler-state";
import { showErrorNotification } from "@kairo/utils";
import { getOrgId, hydrateSession } from "@/lib/auth/client";
import { hasApiError, unwrapApiData } from "@/lib/utils/apiResponse";
import { parseApiError } from "@/lib/utils/parseApiError";
import { users, type UsersQuery } from "@/services/Users";
import type { DashboardUsersPage } from "@/services/Analytics/types";

export interface UsersState {
  users: DashboardUsersPage | null;
  fetchingUsers: boolean;
  queryKey: string | null;
  orgId: string | null;
}

const initialState: UsersState = {
  users: null,
  fetchingUsers: false,
  queryKey: null,
  orgId: null,
};
export const usersStore = entity<UsersState>(initialState);
let latestRequest = 0;

export const fetchUsers = async (filters: UsersQuery) => {
  const request = ++latestRequest;
  let orgId = getOrgId();
  void usersStore.set({
    ...initialState,
    fetchingUsers: true,
    queryKey: JSON.stringify(filters),
    orgId,
  });
  try {
    orgId = orgId ?? (await hydrateSession()).orgId;
    if (request !== latestRequest) return;
    if (!orgId)
      throw new Error("Please sign in to an organization to view this data.");
    const response = await users.getUsers(orgId, filters);
    if (hasApiError(response)) throw response;
    if (request === latestRequest && getOrgId() === orgId) {
      void usersStore.set((s) => ({
        ...s,
        users: unwrapApiData<DashboardUsersPage>(response),
        orgId,
      }));
    }
    return response;
  } catch (error) {
    if (request === latestRequest && getOrgId() === orgId) {
      void usersStore.set((s) => ({ ...s, orgId }));
      showErrorNotification({
        message: parseApiError(
          error,
          "Unable to load users. Please try again.",
        ),
      });
    }
    throw error;
  } finally {
    if (request === latestRequest) {
      void usersStore.set((s) => ({ ...s, fetchingUsers: false }));
    }
  }
};

export const resetUsersStore = (): void => {
  latestRequest++;
  void usersStore.set({ ...initialState });
};
