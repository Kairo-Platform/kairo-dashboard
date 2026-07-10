import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const nonce =
    globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;

  const isDev = process.env.NODE_ENV !== "production";

  const styleSrc = `style-src 'self' 'nonce-${nonce}'`;
  const scriptSrc = isDev
    ? `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval'`
    : `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`;
  const connectSrc = isDev
    ? "connect-src 'self' https://api.usekairo.com ws: wss:"
    : "connect-src 'self' https://api.usekairo.com";

  const csp = [
    "default-src 'self'",
    scriptSrc,
    styleSrc,
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    connectSrc,
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ]
    .join("; ")
    .trim();

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);

  const res = NextResponse.next({ request: { headers: requestHeaders } });

  res.headers.set("Content-Security-Policy", csp);
  res.headers.set("x-nonce", nonce);
  res.headers.set(
    "Permissions-Policy",
    "camera=(self), microphone=(), geolocation=()",
  );

  return res;
}

export const config = {
  matcher: ["/(.*)"],
};
