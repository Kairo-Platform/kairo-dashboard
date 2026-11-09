import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const nonce =
    globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;

  const isDev = process.env.NODE_ENV !== "production";
  const secureForm =
    req.nextUrl.pathname.startsWith("/secure/forms") ||
    req.nextUrl.pathname.startsWith("/api/secure-forms/");

  const styleSrc = `style-src 'self' 'nonce-${nonce}'`;
  const scriptSrc = isDev
    ? `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval'`
    : `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`;
  const connectSrc = isDev
    ? "connect-src 'self' https://usekairo.co https://*.usekairo.co https://api.usekairo.com ws: wss: https://api.iconify.design https://api.simplesvg.com https://api.unisvg.com"
    : "connect-src 'self' https://usekairo.co https://*.usekairo.co https://api.usekairo.com https://api.iconify.design https://api.simplesvg.com https://api.unisvg.com";

  const csp = [
    "default-src 'self'",
    scriptSrc,
    styleSrc,
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    secureForm
      ? isDev
        ? "connect-src 'self' ws: wss:"
        : "connect-src 'self'"
      : connectSrc,
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
  if (secureForm) {
    res.headers.set("Cache-Control", "no-store, private");
    res.headers.set("Referrer-Policy", "no-referrer");
    res.headers.set("X-Content-Type-Options", "nosniff");
  }
  res.headers.set(
    "Permissions-Policy",
    "camera=(self), microphone=(), geolocation=()",
  );

  return res;
}

export const config = {
  matcher: ["/(.*)"],
};
