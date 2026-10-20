import { entity } from "simpler-state";
import { showErrorNotification } from "@kairo/utils";
import { getOrgId, hydrateSession } from "@/lib/auth/client";
import { hasApiError, unwrapApiData } from "@/lib/utils/apiResponse";
import { parseApiError } from "@/lib/utils/parseApiError";
import {
  flow,
  type ConversationControl,
  type AdminMessageRequest,
  type AdminMessageResult,
} from "@/services/Flow";

interface ControlState {
  control: ConversationControl | null;
  userId: string | null;
  orgId: string | null;
  busy: boolean;
}
export const conversationControlStore = entity<ControlState>({
  control: null,
  userId: null,
  orgId: null,
  busy: false,
});
let latestRead = 0;
const organization = async () => {
  const id = getOrgId() ?? (await hydrateSession()).orgId;
  if (!id) throw new Error("Please sign in to an organization to reply.");
  return id;
};
export const fetchConversationControl = async (
  userId: string,
  silent = false,
) => {
  const request = ++latestRead;
  try {
    const orgId = await organization();
    const result = await flow.getConversationControl(orgId, userId);
    if (hasApiError(result)) throw result;
    if (request === latestRead && orgId === getOrgId())
      void conversationControlStore.set((s) => ({
        ...s,
        userId,
        orgId,
        control: unwrapApiData<ConversationControl>(result),
      }));
  } catch (error) {
    if (request === latestRead && !silent)
      showErrorNotification({
        message: parseApiError(error, "Unable to load conversation control."),
      });
  }
};
export const changeConversationControl = async (
  userId: string,
  takeoverId?: string,
) => {
  if (conversationControlStore.get().busy) return;
  latestRead++;
  void conversationControlStore.set((s) => ({ ...s, busy: true }));
  try {
    const orgId = await organization();
    const result = takeoverId
      ? await flow.returnConversationToAgent(orgId, userId, takeoverId)
      : await flow.takeOverConversation(orgId, userId);
    if (hasApiError(result)) throw result;
    latestRead++;
    if (orgId === getOrgId())
      void conversationControlStore.set((s) => ({
        ...s,
        orgId,
        userId,
        control: unwrapApiData<ConversationControl>(result),
      }));
  } catch (error) {
    showErrorNotification({
      message: parseApiError(error, "Unable to change conversation control."),
    });
    await fetchConversationControl(userId, true);
  } finally {
    void conversationControlStore.set((s) => ({ ...s, busy: false }));
  }
};
export const sendConversationMessage = async (
  userId: string,
  input: AdminMessageRequest,
): Promise<AdminMessageResult | null> => {
  if (conversationControlStore.get().busy) return null;
  void conversationControlStore.set((s) => ({ ...s, busy: true }));
  try {
    const response = await flow.sendAdminMessage(
      await organization(),
      userId,
      input,
    );
    if (hasApiError(response)) throw response;
    const result = unwrapApiData<AdminMessageResult>(response);
    if (result.status === "UNKNOWN")
      showErrorNotification({
        message:
          "The send outcome could not be confirmed. Check WhatsApp before sending this message again.",
      });
    await fetchConversationControl(userId, true);
    return result;
  } catch (error) {
    showErrorNotification({
      message: parseApiError(
        error,
        "Unable to confirm the send. Retry the same message to check its result.",
      ),
    });
    await fetchConversationControl(userId, true);
    return null;
  } finally {
    void conversationControlStore.set((s) => ({ ...s, busy: false }));
  }
};
