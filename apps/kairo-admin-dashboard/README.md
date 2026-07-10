# Kairo Admin Dashboard

Admin-facing dashboard for Kairo platform operations.

Part of the [Kairo monorepo](../../README.md).

Communicates with the **backOffice API** only (no xApi in this app).

## Quick start

From the monorepo root:

```bash
pnpm install
pnpm dev:admin
```

Or from this directory:

```bash
pnpm dev
```

Open http://localhost:3000

## Environment

Copy `.env.sample` to `.env.local` and fill in values (`KAIRO_BACK_OFFICE_*`).

## Architecture

- `src/app/api/auth/session` — httpOnly cookie session (POST/GET/DELETE)
- `src/app/api/backoffice/[...path]` — BFF proxy to backoffice API (GAT + service credentials)
- `src/app/auth/login` + `src/app/auth/access-control-flows` — login flow UI
- `src/services/backOffice/` — client modules calling `/api/backoffice/*`
- `src/lib/bff/` — `backOfficeBff` client + `proxyBackOfficeRequest()` server helper

Cookie prefix: `kairo_admin_*`.

Shared UI, theme, and HTTP primitives live in `packages/*`.
