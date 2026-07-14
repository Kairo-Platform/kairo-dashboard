# Kairo Enterprise Dashboard

Enterprise-facing dashboard for Kairo platform customers.

Part of the [Kairo monorepo](../../README.md).

Communicates with the **xApi** backend only — user-facing endpoints, not the backOffice API.

## Quick start

From the monorepo root:

```bash
pnpm install
pnpm dev:enterprise
```

Runs on http://localhost:3001

## Environment

Copy `.env.sample` to `.env.local`.

## Architecture

- `src/app/api/auth/session` — httpOnly cookie session (POST/GET/DELETE)
- `src/app/api/user/me` — current user profile via xApi `GET /v1/me/{{userId}}` (Bearer from session)
- `src/app/api/x-api/[...path]` — BFF proxy to xApi (GAT + service credentials)
- `src/app/auth/login` — login UI
- `src/app/auth/oauth/callback` — single OAuth handoff (`status=success|denied|error`, plus `token`/`userId`/`orgId` on success)
- `src/services/xApi/` — client modules calling `/api/x-api/*` and `/api/user/*`
- `src/lib/bff/` — `xApiBff` client + `proxyXApiRequest()` / `proxyXApiBearerRequest()` server helpers

Cookie prefix: `kairo_enterprise_*` (separate from admin's `kairo_admin_*`).

Shared primitives: `@kairo/auth`, `@kairo/services`.
