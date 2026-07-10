# FFTL: Frontend Engineering SOP

## Kairo Dashboards (Monorepo)

**Audience:** New hires, contributing engineers, maintainers

**Purpose:** Enable engineers to understand, contribute, and ship on the Kairo dashboard monorepo without external guidance.

**Last Updated:** July 2026

---

# SECTION A: KAIRO DASHBOARDS (MONOREPO)

---

## 1. Title & Purpose

**SOP Name:** Frontend Development Process → Kairo Dashboards (Monorepo)

**Owner:** Lead Frontend Engineer

**Purpose:**
Define how frontend applications within the Kairo monorepo are built, maintained, and deployed using shared packages, BFF proxies, and consistent patterns across admin and enterprise dashboards.

---

## 2. Scope

**Covers:**

- All apps inside the monorepo (`apps/*`)
- Shared packages (`packages/*`)
- Feature development, architecture, auth, BFF integration, and deployment

**Does NOT cover:**

- Backend API implementation or microservice internals
- Infrastructure provisioning outside GitHub Actions workflows in this repo

---

## 3. Roles & Responsibilities

**Frontend Engineers**

- Build features in the correct app (`admin` vs `enterprise`)
- Reuse shared packages (`@kairo/ui`, `@kairo/theme`, `@kairo/utils`, etc.)
- Follow BFF and service-layer patterns (no direct backend `fetch` from UI)
- Ensure responsiveness, accessibility, and performance

**Lead Frontend Engineer**

- Own monorepo architecture decisions
- Maintain shared packages and cross-app conventions
- Approve critical PRs and package API changes

**Product / Design**

- Provide Figma designs and UX flows
- Validate UI implementation against design system

**QA Engineers**

- Validate flows in both apps where applicable
- Ensure no regression in shared `packages/ui` components

---

## 4. Tools & Systems Used

| Tool                  | Usage in Kairo                                           |
| --------------------- | -------------------------------------------------------- |
| **Next.js 16**        | App Router in both dashboards                            |
| **TypeScript**        | All apps and packages                                    |
| **pnpm**              | Package manager (`packageManager: pnpm@9`)               |
| **Turborepo**         | Task orchestration (`dev`, `build`, `lint`, `typecheck`) |
| **styled-components** | Component styling via `@kairo/theme`                     |
| **simpler-state**     | App-level global state (`entity`, `useEntity`)           |
| **Zod**               | Form validation (e.g. login schema in `@kairo/utils`)    |
| **`@kairo/services`** | `generateService`, `proxyServiceRequest`                 |
| **`@kairo/auth`**     | httpOnly cookie session primitives                       |
| **GitHub Actions**    | Per-app CI on `staging` and `main`                       |

**Monorepo scripts (root):**

```bash
pnpm install
pnpm dev:admin        # http://localhost:3000
pnpm dev:enterprise   # http://localhost:3001
pnpm build            # build all
pnpm lint
pnpm typecheck
```

**VS Code workspaces:**

- `workspaces/admin.code-workspace`
- `workspaces/enterprise.code-workspace`

---

## 5. Step-by-Step Process (CORE)

### Step 1: Understand Where the Feature Lives

Kairo has **two actively developed apps**. Each app talks to **one backend surface only**.

```text
apps/kairo-admin-dashboard       → Port 3000 → backOffice API only
apps/kairo-enterprise-dashboard  → Port 3001 → xApi only (user-facing endpoints)
```

| App        | Package name                  | Backend target | BFF route           | Service folder             |
| ---------- | ----------------------------- | -------------- | ------------------- | -------------------------- |
| Admin      | `@kairo/admin-dashboard`      | backOffice     | `/api/backoffice/*` | `src/services/backOffice/` |
| Enterprise | `@kairo/enterprise-dashboard` | xApi           | `/api/x-api/*`      | `src/services/xApi/`       |

**Rules:**

- **Never** call backOffice APIs from the enterprise app or xApi from the admin app.
- **xApi** is the frontend name for user-facing endpoints — it is **not** the same as a backend microservice named `user-service`.
- Identify the target app before writing code.
- Pull latest `staging`, then branch:

```text
feat/<feature-name>
fix/<issue-name>
```

---

### Step 2: Monorepo Layout

```text
kairo-dashboard/
├── apps/
│   ├── kairo-admin-dashboard/      # Admin operations
│   └── kairo-enterprise-dashboard/ # Enterprise / customer-facing
├── packages/
│   ├── ui/                         # Shared design system
│   ├── theme/                      # Tokens, KairoTheme, global styles
│   ├── utils/                      # Notifications, Zod schemas, helpers
│   ├── services/                   # generateService, proxyServiceRequest
│   ├── auth/                       # Cookie session primitives
│   ├── hooks/                      # Shared React hooks
│   ├── config-eslint/
│   └── config-typescript/
├── workspaces/                     # Focused VS Code workspaces
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

**Package ownership rule:**

| Layer                                      | Lives in            |
| ------------------------------------------ | ------------------- |
| Reusable UI primitives                     | `packages/ui`       |
| Theme tokens & global CSS                  | `packages/theme`    |
| Cross-app validation & notifications       | `packages/utils`    |
| HTTP factory & BFF proxy helper            | `packages/services` |
| Cookie/session utilities                   | `packages/auth`     |
| Routes, pages, BFF routes, domain services | `apps/*`            |

**Extract to `packages/*` only when** code is shared across apps or stable enough to be a library. Do not prematurely abstract app-specific logic.

---

### Step 3: Per-App Architecture

Each app follows the same internal shape:

```text
apps/<app>/src/
├── app/
│   ├── (routes)/              # Route groups (pages)
│   ├── api/
│   │   ├── auth/session/      # httpOnly cookie session (POST/GET/DELETE)
│   │   └── backoffice|x-api/  # BFF catch-all proxy
│   ├── components/
│   │   ├── ui/                # Re-exports @kairo/ui (+ app overrides if any)
│   │   ├── domain/            # App-specific / domain components
│   │   └── dashboard/         # Layout shells (admin)
│   ├── lib/                   # App-local constants, hooks, utils (admin legacy path)
│   └── store/                 # simpler-state entities
├── lib/
│   ├── auth/                  # App auth config, client helpers, server GAT
│   ├── bff/                   # BFF client + proxyRoute helpers
│   └── constants/             # URL constants (enterprise)
└── services/
    ├── backOffice/            # Admin only
    └── xApi/                  # Enterprise only
```

**Page rule:**

```text
app/(routes)/feature/page.tsx   → Orchestrator (compose UI, wire handlers)
components/domain/*             → Feature UI + feature logic
store/*                         → Global state (simpler-state)
services/*                      → API calls via BFF client
```

---

### Step 4: Build Using Composition

```tsx
<DashboardLayout pageTitle="Dashboard">
  <DashboardContent />
</DashboardLayout>
```

**Rules:**

- Reuse `@kairo/ui` components before creating new ones.
- App `components/ui/index.ts` re-exports `@kairo/ui` — import from `@/app/components/ui` in pages.
- Put domain-specific tags and widgets in `components/domain/`.
- No business logic in layouts.
- No direct backend `fetch` in components — use service modules.
- No duplicate UI that already exists in `packages/ui`.

---

### Step 5: State Management

**Global state (simpler-state):**

```ts
import { entity } from "simpler-state";

export const auth = entity<AuthState>({ ... });
```

**Usage:**

```ts
import { useEntity } from "simpler-state";

const state = useEntity(auth);
```

**Rules:**

- Prefer `useState` / `useReducer` for local UI state.
- Use `entity` only when state is shared across modules (e.g. `store/auth.ts`).
- Keep entities normalized and scoped per app — do not share app store across admin and enterprise.

---

### Step 6: API Integration (BFF Pattern)

**Request flow:**

```text
Component/Page
  → services/<backOffice|xApi>/Module
    → backOfficeBff | xApiBff (client)
      → /api/backoffice/* | /api/x-api/* (Next.js route handler)
        → proxyBackOfficeRequest | proxyXApiRequest (server)
          → proxyServiceRequest (@kairo/services)
            → backend (backOffice URL | xApi URL)
```

**Client example (admin):**

```ts
import { backOfficeBff } from "@/lib/bff/client";

export const users = {
  getAuthUser: () => backOfficeBff.request("users/me", { method: "GET" }),
};
```

**Service module example (enterprise auth):**

```ts
import { xApiBff } from "@/lib/bff/client";

export const xApiAuth = {
  login: (data) =>
    xApiBff.request("auth/login", { method: "POST", body: data }),
};
```

**Rules:**

- **No direct `fetch` to backend base URLs from the browser.**
- All backend calls go through the app BFF (`/api/backoffice` or `/api/x-api`).
- BFF route handlers contain **proxy logic only** — no business rules.
- Server-side proxy reads GAT from httpOnly cookies via `getServerGat()` and attaches service credentials from env.
- Always handle loading, error, and empty states in the UI.
- Use `getApiData()` / `parseApiError()` helpers for response shaping (app `lib/utils` or enterprise `lib/utils`).

**Environment variables:**

Admin (`apps/kairo-admin-dashboard/.env.local`):

```env
KAIRO_BACK_OFFICE_URL=
KAIRO_BACK_OFFICE_API_USERNAME=
KAIRO_BACK_OFFICE_API_PASSWORD=
```

Enterprise (`apps/kairo-enterprise-dashboard/.env.local`):

```env
KAIRO_X_API_URL=
KAIRO_X_API_USERNAME=
KAIRO_X_API_PASSWORD=
```

---

### Step 7: Authentication

Kairo uses **httpOnly cookie sessions**, not client-readable auth tokens.

| App        | Cookie prefix        | Session route       |
| ---------- | -------------------- | ------------------- |
| Admin      | `kairo_admin_*`      | `/api/auth/session` |
| Enterprise | `kairo_enterprise_*` | `/api/auth/session` |

**Flow:**

1. User submits login form.
2. Service calls BFF → backend `auth/login`.
3. On success, `applyAuthPayload()` persists session via `POST /api/auth/session`.
4. `LoadingWrapper` calls `hydrateSession()` on app load.
5. BFF proxy reads GAT server-side for authenticated API calls.

**Login validation (shared):**

```ts
import { validateLoginWithEmailAndPassword } from "@kairo/utils";
```

Both apps validate email/password with Zod before calling the auth service. Field errors are passed to `FormInput` via the `message` prop.

**Access-control flows (enterprise only):**

Multi-step auth (OTP, stages, etc.) helpers live in the **enterprise** app:

- `src/lib/hooks/useAccessControlFlow.ts`
- `src/lib/utils/accessControlFlowHelpers.ts`
- `src/services/xApi/Auth` — `initiateLogin`, `processFlowStage`, etc.

Admin uses **direct login** (`auth/login` → dashboard) until product requirements change.

---

### Step 8: UI & Styling

- Import components from `@kairo/ui` (via app `components/ui`).
- Wrap apps in `@kairo/theme` (`KairoTheme`, `StyledRegistry`, `globalStyle`).
- Use theme tokens — never hardcode design values.

```ts
color: ${({ theme }) => theme.colors.text_01};
font-size: ${({ theme }) => theme.typography.fontSize.base};
font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
```

**Typography:**

| Role                 | Font                       |
| -------------------- | -------------------------- |
| Body                 | Satoshi (`--font-satoshi`) |
| Headings (`h1`–`h6`) | DM Sans (`--font-dm-sans`) |

**Notifications:**

```ts
import { showErrorNotification, showSuccessNotification } from "@kairo/utils";
```

---

### Step 9: URL-Driven State

Use Next.js App Router primitives for shareable/bookmarkable UI state:

```ts
import { useSearchParams, useRouter } from "next/navigation";
```

Route constants live in app URL modules:

- Admin: `src/app/lib/constants/URL.ts`
- Enterprise: `src/lib/constants/URL.ts`

---

### Step 10: Testing & Quality

Before opening a PR, from the monorepo root:

```bash
pnpm lint
pnpm typecheck
pnpm build:admin      # when admin changed
pnpm build:enterprise # when enterprise changed
```

Test critical flows manually:

- Login (admin + enterprise)
- Session hydration after refresh
- Dashboard shell / navigation (admin)
- BFF-proxied API calls with valid env configuration

---

### Step 11: PR & Merge

**Branching model:**

```text
feature/*  →  PR to staging  →  validate  →  merge to main  →  production
```

**PR requirements:**

- Clear description of app(s) affected
- Screenshots or screen recording for UI changes
- Confirm env/sample updates if new variables are introduced
- CI must pass

**CI (per app, path-filtered):**

- `admin-staging.yml` / `admin-prod.yml` → `@kairo/admin-dashboard`
- `enterprise-staging.yml` / `enterprise-prod.yml` → `@kairo/enterprise-dashboard`

Each workflow runs: `pnpm install` → `turbo lint typecheck build --filter=<app>`.

**Review & merge:**

- Minimum 1 approval
- Merge into `staging` first
- Promote to `main` after QA validation on staging

---

## 6. Decision Points

| Scenario                         | Action                                                                |
| -------------------------------- | --------------------------------------------------------------------- |
| New UI component needed          | Check `packages/ui` first → extend or add there if shared             |
| Feature touches both apps        | Split work: shared logic in `packages/*`, app wiring in each app      |
| Unsure which backend API         | Admin = backOffice. Enterprise = xApi. Ask if unclear.                |
| New env variable                 | Add to app `.env.sample`, document in README, wire in `proxyRoute.ts` |
| State scope unclear              | Prefer local state first, then `entity` if cross-module               |
| Code reusable across apps        | Extract to `packages/*` incrementally — not on first use              |
| Access-control / multi-step auth | Enterprise app only (`xApi` services + hooks)                         |
| Architecture change              | Escalate to Lead Frontend Engineer                                    |

---

## 7. SLAs / Timelines

- **PR review:** within 24 hours
- **Bug fix (production):** same day triage; fix per severity
- **Feature delivery:** sprint-based

---

## 8. Output / Success Criteria

- Correct app and backend target (no API cross-wiring)
- Shared components reused; no unnecessary duplication
- Matches design and theme tokens
- No lint or TypeScript errors
- BFF proxy pattern respected (no exposed backend URLs client-side)
- Cookie auth lifecycle handled (login, hydrate, logout)

---

## 9. Templates / Resources

| Resource              | Location                                                                            |
| --------------------- | ----------------------------------------------------------------------------------- |
| Shared UI             | `packages/ui/src`                                                                   |
| Theme tokens          | `packages/theme/src/tokens.ts`                                                      |
| Login Zod schema      | `packages/utils/src/validation/loginWithEmailAndPasswordSchema.ts`                  |
| HTTP factory          | `packages/services/src/generateService.ts`                                          |
| BFF proxy helper      | `packages/services/src/proxyServiceRequest.ts`                                      |
| Admin BFF client      | `apps/kairo-admin-dashboard/src/lib/bff/client.ts`                                  |
| Enterprise BFF client | `apps/kairo-enterprise-dashboard/src/lib/bff/client.ts`                             |
| Admin services        | `apps/kairo-admin-dashboard/src/services/backOffice/`                               |
| Enterprise services   | `apps/kairo-enterprise-dashboard/src/services/xApi/`                                |
| Admin login page      | `apps/kairo-admin-dashboard/src/app/(routes)/auth/login/page.tsx`                   |
| Enterprise login page | `apps/kairo-enterprise-dashboard/src/app/(routes)/auth/login/page.tsx`              |
| Root README           | `README.md`                                                                         |
| App READMEs           | `apps/kairo-admin-dashboard/README.md`, `apps/kairo-enterprise-dashboard/README.md` |

---

## 10. Escalation Path

| Issue type                                | Escalate to                                   |
| ----------------------------------------- | --------------------------------------------- |
| Backend API contract / response shape     | Backend team                                  |
| Design mismatch or missing specs          | Product / Design                              |
| Monorepo architecture, package boundaries | Lead Frontend Engineer                        |
| Auth / session / cookie security          | Lead Frontend Engineer (urgent if production) |
| CI / deploy pipeline                      | DevOps / Lead Frontend Engineer               |

---

# SECTION B: PER-APP PATTERNS (WITHIN MONOREPO APPS)

---

This section describes the **internal structure of each Kairo app**. Both `kairo-admin-dashboard` and `kairo-enterprise-dashboard` follow these patterns. This is not a separate standalone repository — it is how each app inside the monorepo is organized.

---

## 1. Title & Purpose

**SOP Name:** Per-App Frontend Patterns → Kairo Dashboard Apps

**Purpose:** Define the folder structure, routing, and implementation rules inside a single Kairo app (`apps/*`).

---

## 2. Scope

**Covers:**

- `src/` layout inside `apps/kairo-admin-dashboard` and `apps/kairo-enterprise-dashboard`
- Routing, components, services, auth, and BFF within one app

**Does NOT cover:**

- Monorepo workspace setup (see Section A)
- Shared package authoring (see Section A, Step 2)

---

## 3. Project Structure

```text
src/
  app/
    (routes)/           → Page routes (e.g. auth/login, dashboard)
    api/
      auth/session/     → Cookie session handlers
      backoffice/       → Admin BFF only
      x-api/            → Enterprise BFF only
    components/
      ui/               → Re-exports @kairo/ui
      domain/           → Domain-specific components (tags, widgets)
      dashboard/        → Layout chrome (admin)
    lib/                → App constants, hooks, utils (admin legacy layout)
    store/              → simpler-state entities
    styles/             → Theme wrapper, notification CSS
    globals.css
  lib/
    auth/               → config, client helpers, server GAT reader
    bff/                → client.ts (BFF fetch) + proxyRoute.ts (server proxy)
    constants/          → URL and shared enums (enterprise)
    hooks/              → App-specific hooks (e.g. useAccessControlFlow)
    utils/              → parseApiError, getApiData, flow helpers (enterprise)
  services/
    backOffice/         → Admin API modules
    xApi/               → Enterprise API modules
  proxy.ts              → Next.js middleware (if present)
```

---

## 4. Routing

```text
(auth)/login              → /auth/login
dashboard                 → /dashboard
(auth)/access-control-flows → enterprise only (when implemented)
```

Use `app/(routes)/` route groups to organize pages without affecting the URL.

---

## 5. Component Rules

| Type          | Location                   | Example                                 |
| ------------- | -------------------------- | --------------------------------------- |
| Design system | `packages/ui`              | `Button`, `FormInput`, `Table`          |
| App UI barrel | `app/components/ui`        | Re-export from `@kairo/ui`              |
| Domain        | `app/components/domain`    | `UserStatusTag`, `TransactionStatusTag` |
| Layout        | `app/components/dashboard` | `DashboardLayout`, `DashboardSidebar`   |
| Page          | `app/(routes)/*/page.tsx`  | Orchestration only                      |

---

## 6. Forms & Validation

Prefer native `<form>` + shared `FormInput` from `@kairo/ui` + **Zod** validation from `@kairo/utils`.

```ts
const validation = validateLoginWithEmailAndPassword({ email, password });
if (!validation.success) {
  setFieldErrors(validation.errors);
  return;
}
```

Pass errors to inputs:

```tsx
<FormInput
  message={
    fieldErrors.email
      ? { type: "error", content: fieldErrors.email }
      : undefined
  }
/>
```

---

## 7. Security

- Auth tokens (GAT) stored in **httpOnly cookies** — never in `localStorage`.
- Backend base URLs and service credentials exist **only server-side** (env + BFF).
- Client BFF calls use `credentials: "include"`.
- Separate cookie namespaces per app (`kairo_admin_*` vs `kairo_enterprise_*`).
- Do not read tokens client-side for API calls — the BFF attaches GAT on the server.

---

## 8. Performance

- Use dynamic imports for heavy route-level components when needed.
- Avoid unnecessary re-renders in dashboard layouts and tables.
- Run `pnpm build:<app>` to catch bundle and type issues before merge.
- Shared packages are built as dependencies via Turborepo (`dependsOn: ["^build"]`).

---

## 9. Output / Success Criteria

- Clean separation: pages orchestrate, components render, services fetch via BFF.
- Auth and proxy patterns followed consistently.
- App-specific code stays in the app; truly shared code lives in `packages/*`.
- Production build passes for the affected app.

---

## Author

- [Stanley Azi (Frontend)](https://github.com/Stan015)
