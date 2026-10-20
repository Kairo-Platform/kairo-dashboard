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
- `src/app/api/user/me` — current user profile via xApi `GET /v1/me` (Bearer from session)
- `src/app/api/x-api/[...path]` — BFF proxy to xApi (Bearer from session when present, otherwise service Basic auth)
- `src/app/auth/login` — login UI
- `src/app/auth/callback` — Google OAuth return (`status=SUCCESS|DENIED|ERROR`, `code`, `new`); exchanges code via `POST /v1/auth/oauth/exchange`
- `src/services/Auth/` — auth client (`login`, `signup`, OAuth, access-control flows)
- `src/services/Users/` — user client (`me`, paginated users)
- `src/lib/bff/` — BFF client + `proxyXApiRequest()` / `proxyXApiBearerRequest()` server helpers

Cookie prefix: `kairo_enterprise_*` (separate from admin's `kairo_admin_*`).

Shared primitives: `@kairo/auth`, `@kairo/services`.

## Dashboard APIs

Requests use the BFF (`/api/x-api`) with the dashboard session and organization ID.
Integration follows **page → store → service → BFF**.

| Endpoint                                               | Purpose                               |
| ------------------------------------------------------ | ------------------------------------- |
| `GET /v1/orgs/{orgId}/conversations`                   | Paginated conversations               |
| `GET /v1/orgs/{orgId}/conversations/{userId}`          | One customer's message history        |
| `GET /v1/orgs/{orgId}/analytics`                       | Overview and Flow metrics             |
| `GET /v1/orgs/{orgId}/users`                           | Paginated customers and status counts |
| `POST /v1/orgs/{orgId}/flow/broadcasts`                | Queue a WhatsApp broadcast            |
| `GET /v1/orgs/{orgId}/flow/broadcasts`                 | Search/filter broadcast history       |
| `GET /v1/orgs/{orgId}/flow/broadcasts/{id}/details`    | Broadcast message and counts          |
| `GET /v1/orgs/{orgId}/flow/broadcasts/{id}/recipients` | Search/filter recipient statuses      |

Lists support `page`, `limit` (default 10), `search`, `startDate`, and `endDate`.
Use `agent=flow` for Flow conversations/analytics. Analytics defaults to today;
lists have no date filter by default. Unavailable metrics display `N/A`.

Services: `Users`, `Analytics`, and `Flow`. Stores: `users.ts`, `analytics.ts`, and
`flow.ts`. Full API documentation lives in the backend repository.

Broadcasts use `Broadcasts` → `broadcasts.ts`, with recipient search through `Users`.
