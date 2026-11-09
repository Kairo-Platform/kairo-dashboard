import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { resolveXApiBaseUrl } from "@/lib/bff/proxyRoute";
import { submissionSchema } from "@/services/secure-forms/onboarding/schema";

import {
  transferPinSchema,
  businessSetupSchema,
} from "@/services/secure-forms/actions";

export const dynamic = "force-dynamic";
const production = process.env.NODE_ENV === "production";
// Only registered handlers can accept a capability; never construct arbitrary backend paths.
const handlers = {
  onboarding: { path: "onboarding", schema: submissionSchema },
  transfer_pin: { path: "transfer_pin", schema: transferPinSchema },
  business_setup: { path: "business_setup", schema: businessSetupSchema },
} as const;
const capability = z.string().regex(/^[A-Za-z0-9_-]{43}$/);
const headers = {
  "Cache-Control": "no-store, private",
  "Referrer-Policy": "no-referrer",
};
type Context = { params: Promise<{ type: string; action: string }> };

function sameOrigin(request: NextRequest) {
  try {
    const origin = new URL(request.headers.get("origin") ?? "");
    // Host survives the deployment proxy even when Next's internal URL uses localhost.
    return (
      origin.host === request.headers.get("host") &&
      (origin.protocol === "https:" ||
        (!production && origin.protocol === "http:"))
    );
  } catch {
    return false;
  }
}

async function readBody(request: NextRequest) {
  if (Number(request.headers.get("content-length")) > 8192)
    throw new Error("size");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("body");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const next = await reader.read();
      if (next.done) break;
      size += next.value.length;
      if (size > 8192) {
        await reader.cancel();
        throw new Error("size");
      }
      chunks.push(next.value);
    }
  } finally {
    reader.releaseLock();
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

async function handle(request: NextRequest, context: Context) {
  const { type, action } = await context.params;
  if (!Object.hasOwn(handlers, type))
    return NextResponse.json(
      { error: "This secure form is not available yet." },
      { status: 404, headers },
    );
  const handler = handlers[type as keyof typeof handlers];
  const cookieName = `${production ? "__Host-" : ""}kairo_form_${handler.path}`;
  if (
    !["exchange", "session"].includes(action) ||
    (action === "exchange" && request.method !== "POST")
  ) {
    return NextResponse.json({ error: "Not found" }, { status: 404, headers });
  }
  if (
    request.method !== "GET" &&
    (!sameOrigin(request) || request.headers.get("X-Kairo-Form") !== "1")
  ) {
    return NextResponse.json(
      { error: "Please submit this form from its original page." },
      { status: 403, headers },
    );
  }
  const jar = await cookies();
  const cookieOptions = {
    httpOnly: true,
    secure: production,
    sameSite: "strict" as const,
    path: "/",
  };
  if (request.method === "DELETE") {
    jar.set(cookieName, "", { ...cookieOptions, maxAge: 0 });
    return NextResponse.json({ ok: true }, { headers });
  }
  try {
    const session = capability.safeParse(jar.get(cookieName)?.value);
    if (action === "session" && !session.success)
      return NextResponse.json(
        { error: "Open a new secure form from your Kairo conversation." },
        { status: 401, headers },
      );
    const body =
      request.method === "POST" ? await readBody(request) : undefined;
    const payload =
      action === "exchange"
        ? z.object({ token: capability }).parse(body)
        : body === undefined
          ? undefined
          : handler.schema.parse(body);
    const base = resolveXApiBaseUrl();
    if (!base) throw new Error("config");
    // This endpoint uses the form capability, never an administrator's credentials.
    const response = await fetch(
      `${base.replace(/\/$/, "").replace(/\/v1$/, "")}/v1/agents/flow/hosted-forms/${handler.path}/${action}`,
      {
        method: request.method,
        cache: "no-store",
        redirect: "error",
        signal: AbortSignal.timeout(30000),
        headers: {
          "Content-Type": "application/json",
          ...(session.success && action === "session"
            ? { Authorization: `Bearer ${session.data}` }
            : {}),
        },
        ...(payload === undefined ? {} : { body: JSON.stringify(payload) }),
      },
    );
    const result = await response.json();
    if (!response.ok)
      return NextResponse.json(
        {
          error:
            typeof result.error === "string"
              ? result.error.slice(0, 240)
              : "Unable to continue. Please try again.",
        },
        { status: response.status, headers },
      );
    if (result.type !== type)
      throw new Error("Form type does not match the session");
    if (action === "exchange") {
      jar.set(cookieName, capability.parse(result.sessionToken), {
        ...cookieOptions,
        maxAge: 1800,
      });
      return NextResponse.json({ ok: true }, { headers });
    }
    return NextResponse.json(result, { headers });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof z.ZodError
            ? "Please check the details you entered."
            : type === "transfer_pin" &&
                action === "session" &&
                request.method === "POST"
              ? "I couldn’t confirm this authorization. Return to your conversation to check its status before trying again."
              : "Unable to continue. Please try again or open a new form from your Kairo conversation.",
      },
      { status: 400, headers },
    );
  }
}
export const GET = handle;
export const POST = handle;
export const DELETE = handle;
