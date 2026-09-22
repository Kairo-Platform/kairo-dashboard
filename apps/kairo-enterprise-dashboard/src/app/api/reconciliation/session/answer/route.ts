import WebSocket from "ws";
import { getReconciliationSession } from "@/lib/reconciliationSessionRegistry";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const apiKey = request.headers.get("x-api-key");
  const body = (await request.json()) as {
    sessionId?: string;
    questionId?: string;
    answer?: string;
  };

  if (!apiKey || !body.sessionId || !body.questionId || !body.answer?.trim()) {
    return Response.json(
      {
        statusCode: 400,
        message: "Session, question, answer and API key are required",
      },
      { status: 400 },
    );
  }

  const session = getReconciliationSession(body.sessionId);
  if (!session || session.apiKey !== apiKey) {
    return Response.json(
      {
        statusCode: 404,
        message: "Reconciliation session is no longer available",
      },
      { status: 404 },
    );
  }
  if (session.socket.readyState !== WebSocket.OPEN) {
    return Response.json(
      { statusCode: 409, message: "Reconciliation session is not open" },
      { status: 409 },
    );
  }

  session.socket.send(
    JSON.stringify({
      type: "answer",
      questionId: body.questionId,
      answer: body.answer.trim(),
    }),
  );

  return Response.json({ sent: true });
}
