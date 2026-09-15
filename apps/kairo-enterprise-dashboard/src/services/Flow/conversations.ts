import type { FlowConversation } from "./types";

export function parseConversationNumber(
  value: string | null,
  fallback = 20,
): number {
  const number = Number(value);
  return Number.isSafeInteger(number) && number > 0 ? number : fallback;
}

export function mapConversation(conversation: FlowConversation) {
  const messages = [...conversation.messages].sort(
    (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt),
  );
  return {
    id: conversation.id,
    user: conversation.user.displayName || conversation.user.channelUserId,
    message: messages.at(-1)?.text || "",
    channel: conversation.user.channel,
    status: "",
    createdAt: conversation.lastMessageAt,
    dateTime: conversation.lastMessageAt,
  };
}
