# Kairo Monorepo

Monorepo for Kairo dashboard applications and shared frontend packages.

## Apps

| App                                                             | Package                       | Port | Description                   |
| --------------------------------------------------------------- | ----------------------------- | ---- | ----------------------------- |
| [kairo-admin-dashboard](./apps/kairo-admin-dashboard)           | `@kairo/admin-dashboard`      | 3000 | Admin operations dashboard    |
| [kairo-enterprise-dashboard](./apps/kairo-enterprise-dashboard) | `@kairo/enterprise-dashboard` | 3001 | Enterprise customer dashboard (xApi) |

## Packages

| Package                    | Description                                                          |
| -------------------------- | -------------------------------------------------------------------- |
| `@kairo/config-typescript` | Shared TypeScript configs                                            |
| `@kairo/config-eslint`     | Shared ESLint config                                                 |
| `@kairo/services`          | HTTP service factory (`generateService`)                             |
| `@kairo/theme`             | Theme tokens, `KairoTheme`, `StyledRegistry`, global styles          |
| `@kairo/ui`                | Shared design system components and inputs                           |
| `@kairo/hooks`             | Shared React hooks                                                   |
| `@kairo/utils`             | Shared utilities and notifications                                   |
| `@kairo/auth`              | Cookie/session primitives (app-specific auth flows stay in each app) |

## Quick start

```bash
pnpm install
pnpm dev:admin        # http://localhost:3000
pnpm dev:enterprise   # http://localhost:3001
pnpm build            # build all apps
```

## Workspace files

Open a focused VS Code workspace:

- `workspaces/admin.code-workspace`
- `workspaces/enterprise.code-workspace`

## Architecture principles

- **App-owned**: routes, BFF (`app/api/*`), domain services, auth flows
- **Package-owned**: UI primitives, theme, HTTP helpers, cookie utilities
- **Extract incrementally**: move code to `packages/*` only when shared or stable

## Branching & deploy

- `feature/*` → PR to `staging` → staging deploy
- `staging` validated → merge to `main` → production deploy
- GitHub Actions workflows are scoped per app with path filters

## Environment

Each app has its own `.env.sample`. Copy to `.env.local` inside the app directory.
