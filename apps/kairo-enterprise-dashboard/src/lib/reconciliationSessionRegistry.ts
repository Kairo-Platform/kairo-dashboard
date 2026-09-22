import type WebSocket from "ws";

type SessionEntry = {
  socket: WebSocket;
  apiKey: string;
};

const globalRegistry = globalThis as typeof globalThis & {
  reconciliationSessions?: Map<string, SessionEntry>;
};

const sessions =
  globalRegistry.reconciliationSessions ?? new Map<string, SessionEntry>();
globalRegistry.reconciliationSessions = sessions;

export const registerReconciliationSession = (
  sessionId: string,
  socket: WebSocket,
  apiKey: string,
) => sessions.set(sessionId, { socket, apiKey });

export const unregisterReconciliationSession = (
  sessionId: string,
  socket: WebSocket,
) => {
  if (sessions.get(sessionId)?.socket === socket) sessions.delete(sessionId);
};

export const getReconciliationSession = (sessionId: string) =>
  sessions.get(sessionId);
