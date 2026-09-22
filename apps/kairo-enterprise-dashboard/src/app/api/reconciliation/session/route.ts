import WebSocket from "ws";
import { resolveXApiBaseUrl } from "@/lib/bff/proxyRoute";
import {
  registerReconciliationSession,
  unregisterReconciliationSession,
} from "@/lib/reconciliationSessionRegistry";

export const runtime = "nodejs";

function resolveSessionUrl(path: string): string {
  const baseUrl = resolveXApiBaseUrl();
  if (!baseUrl) throw new Error("KAIRO_X_API_URL is not configured");

  const base = new URL(baseUrl);
  const target = new URL(path, base);
  if (target.origin !== base.origin) {
    throw new Error("Invalid reconciliation session URL");
  }
  target.protocol = target.protocol === "https:" ? "wss:" : "ws:";
  return target.toString();
}

export async function POST(request: Request) {
  const apiKey = request.headers.get("x-api-key");
  if (!apiKey) {
    return Response.json(
      { statusCode: 400, message: "X-Api-Key is required" },
      { status: 400 },
    );
  }

  let wsUrl: string;
  let sessionId: string;
  try {
    const body = (await request.json()) as {
      wsUrl?: string;
      sessionId?: string;
    };
    if (!body.wsUrl) throw new Error("Session URL is required");
    if (!body.sessionId) throw new Error("Session ID is required");
    wsUrl = resolveSessionUrl(body.wsUrl);
    sessionId = body.sessionId;
  } catch (error) {
    return Response.json(
      {
        statusCode: 400,
        message: error instanceof Error ? error.message : "Invalid request",
      },
      { status: 400 },
    );
  }

  const encoder = new TextEncoder();
  let socket: WebSocket | undefined;
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      socket = new WebSocket(wsUrl, { headers: { "X-Api-Key": apiKey } });
      registerReconciliationSession(sessionId, socket, apiKey);
      socket.on("message", (data) => {
        controller.enqueue(encoder.encode(`${data.toString()}\n`));
      });
      socket.on("error", (error) => {
        controller.error(error);
      });
      socket.on("close", () => {
        unregisterReconciliationSession(sessionId, socket!);
        try {
          controller.close();
        } catch {
          // The stream may already be closed after an error.
        }
      });
    },
    cancel() {
      if (socket) unregisterReconciliationSession(sessionId, socket);
      socket?.close();
    },
  });

  request.signal.addEventListener("abort", () => socket?.close(), {
    once: true,
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
