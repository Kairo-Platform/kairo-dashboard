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
- `src/app/api/x-api/[...path]` — BFF proxy to xApi (GAT + service credentials)
- `src/app/auth/login` — login UI
- `src/services/xApi/` — client modules calling `/api/x-api/*`
- `src/lib/bff/` — `xApiBff` client + `proxyXApiRequest()` server helper

Cookie prefix: `kairo_enterprise_*` (separate from admin's `kairo_admin_*`).

Shared primitives: `@kairo/auth`, `@kairo/services`.
