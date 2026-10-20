import { entity } from "simpler-state";
import { showErrorNotification } from "@kairo/utils";
import { getOrgId, hydrateSession } from "@/lib/auth/client";
import { unwrapApiData } from "@/lib/utils/apiResponse";
import { parseApiError } from "@/lib/utils/parseApiError";
import {
  broadcasts,
  type BroadcastRequest,
  type BroadcastSummary,
} from "@/services/Broadcasts";
import { users } from "@/services/Users";
import type { DashboardUsersPage } from "@/services/Analytics/types";

interface BroadcastState {
  users: DashboardUsersPage | null;
  loadingUsers: boolean;
  submitting: boolean;
  orgId: string | null;
}
const initialState: BroadcastState = {
  users: null,
  loadingUsers: false,
  submitting: false,
  orgId: null,
};
export const broadcastsStore = entity<BroadcastState>(initialState);
let latestSearch = 0;

const organization = async () => {
  const id = getOrgId() ?? (await hydrateSession()).orgId;
  if (!id)
    throw new Error("Please sign in to an organization to send a broadcast.");
  return id;
};

export const fetchBroadcastUsers = async (page: number, search: string) => {
  const request = ++latestSearch;
  void broadcastsStore.set((s) => ({ ...s, users: null, loadingUsers: true }));
  try {
    const orgId = await organization();
    const response = await users.getUsers(orgId, { page, limit: 10, search });
    if (request === latestSearch && getOrgId() === orgId) {
      void broadcastsStore.set((s) => ({
        ...s,
        users: unwrapApiData<DashboardUsersPage>(response),
        orgId,
      }));
    }
  } catch (error) {
    if (request === latestSearch)
      showErrorNotification({
        message: parseApiError(error, "Unable to load users."),
      });
  } finally {
    if (request === latestSearch)
      void broadcastsStore.set((s) => ({ ...s, loadingUsers: false }));
  }
};

export const createBroadcast = async (
  input: BroadcastRequest,
): Promise<BroadcastSummary> => {
  if (broadcastsStore.get().submitting)
    throw new Error("A broadcast request is already being submitted.");
  void broadcastsStore.set((s) => ({ ...s, submitting: true }));
  try {
    return unwrapApiData<BroadcastSummary>(
      await broadcasts.create(await organization(), input),
    );
  } catch (error) {
    showErrorNotification({
      message: parseApiError(
        error,
        "Unable to queue broadcast. Please try again.",
      ),
    });
    throw error;
  } finally {
    void broadcastsStore.set((s) => ({ ...s, submitting: false }));
  }
};

export const resetBroadcastUsers = () => {
  latestSearch++;
  void broadcastsStore.set((s) => ({
    ...initialState,
    submitting: s.submitting,
  }));
};
