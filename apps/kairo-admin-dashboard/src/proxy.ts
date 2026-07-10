import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  // Generate a nonce using Web Crypto API (UUID v4)
  const nonce =
    globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;

  // Build a CSP with nonce
  const isDev = process.env.NODE_ENV !== "production";

  const styleSrc = "style-src 'self' 'nonce-" + nonce + "'";
  const scriptSrc = isDev
    ? `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval'`
    : `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`;
  const connectSrc = isDev
    ? "connect-src 'self' https://api.usekairo.com ws: wss: https://api.iconify.design https://api.simplesvg.com https://api.unisvg.com"
    : "connect-src 'self' https://api.usekairo.com https://api.iconify.design https://api.simplesvg.com https://api.unisvg.com";
  const frameSrc = "frame-src 'self' https://image.usekairo.com";

  const csp = [
    "default-src 'self'",
    scriptSrc,
    styleSrc,
    frameSrc,
    "img-src 'self' data: blob: https://image.usekairo.com https://res.cloudinary.com",
    "font-src 'self' data:",
    connectSrc,
    // Disallow risky features
    "frame-ancestors 'none'",
    "object-src 'none'",
    // Additional hardening
    "base-uri 'self'",
    "form-action 'self'",
    "media-src 'self'",
    "manifest-src 'self'",
    "worker-src 'self'",
    "child-src 'self'",
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
