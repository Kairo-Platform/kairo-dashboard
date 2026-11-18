# Kairo engineering rules

## Ownership and reuse

- Identify the target app first: `apps/kairo-admin-dashboard` or `apps/kairo-enterprise-dashboard`.
- Search existing app feature components and shared packages before creating UI. Read matching component implementations and prop types, not just their export names.
- Reuse `@kairo/ui`, `@kairo/ui/inputs`, `@kairo/theme`, `@kairo/hooks`, `@kairo/utils`, and `@kairo/lib` where appropriate. Keep app-specific services, routes, BFF endpoints, and auth flows in the app. Extract stable, shared UI into the existing packages rather than copying it across dashboards.
- Use styled-components, theme colors and breakpoints, and nearby class naming patterns. Do not introduce Tailwind or parallel Button, Table, Tabs, Drawer, Modal, or input primitives.
- Match the target app's existing page layout, headings, spacing, actions, loading/empty states, and responsive behavior. Preserve user-started component shells.
- Separate substantial table, filter, drawer, modal, and form implementations into clearly named components. Pages compose these pieces; do not place all their UI and business logic in one component. Share create/edit forms when their differences are hydration and submission.
- Use existing notification helpers for operation errors, success, and information. Keep field validation in the custom input's supported message props; inspect its types first. Follow the target app's validation setup and use Zod where it is installed.
- Verify APIs against existing services, BFF routes, types, and supplied contracts. Do not invent endpoints, payloads, or backend enums.

## Comment style (non-negotiable)

- Use `// comment` only — never `/** */` or `/* */`
- No section-divider banners (`// ----`, `// ===`, `// ── helpers ──`)
- No inline comments inside object literals or type bodies
- Only write a comment when the intent is non-obvious from the code itself — never narrate what the line does

```ts
// good
// ISO language codes pass through unchanged; everything else → UPPER_SNAKE
export function toBackendEnum(value: string): string { ... }

// bad
/** Maps a frontend value to UPPER_CASE. */
export function toBackendEnum(value: string): string { ... }

// bad — comment inside object
export type BackendButton = {
  /** UPPER_CASE enum e.g. "REPLY" */
  type: string;
};
```

## Service folder structure

New app-owned services live in their own folder under `src/services/<ServiceName>/` with separate responsibilities:

```
src/services/Flow/
  types.ts        ← all TypeScript types, no logic
  mappers.ts      ← pure mapping/helper functions, imports from types.ts
  FlowService.ts  ← the service object, imports from types.ts
  index.ts        ← barrel: export * from each file, nothing else
```

`index.ts` must contain only barrel exports — no logic, no types inline:

```ts
// good — index.ts
export * from "./types";
export * from "./mappers";
export * from "./FlowService";

// bad — logic or types defined directly in index.ts
export const flow = { ... };
export type BackendButton = { ... };
```

Consumers always import from the folder (`@/services/Flow`), never from the sub-files directly.

Large services may use additional focused modules, as the existing Flow service does. Keep existing service names and public imports stable when extending them.

## Store management (non-negotiable)

For enterprise dashboard data fetching, follow this pattern:

- GET calls must be managed in `src/app/store/<service>.ts` using `simpler-state`
- Components must read store state with `useEntity(store)` (never `store.use()`)
- Components must call store fetch actions for GETs (never call GET service methods directly)
- POST / PUT / PATCH / DELETE calls can be called directly from the service in components/actions
- Keep store state flat with explicit `fetchingX` and `x` keys, plus dedicated setters and reset action
- Handle fetch errors in store actions with `showErrorNotification({ message: parseApiError(...) })`
- Shared API response helpers must be centralized in global utils (`src/lib/utils`) and reused by stores/services
- Shared API response shapes must live in `src/types` (e.g. `ApiLike`), not duplicated inside store files
- Do not keep duplicate API error parsers; prefer `parseApiError` as the single shared parser

Example shape:

```ts
import { entity, useEntity } from "simpler-state";

export const flowStore = entity(initialState);
const { flowSettings, fetchingFlowSettings } = useEntity(flowStore);
```

## Validation

Use the affected workspace's scripts: `pnpm --filter @kairo/enterprise-dashboard typecheck`, `pnpm --filter @kairo/enterprise-dashboard lint`, or the corresponding `@kairo/admin-dashboard` commands. Include both apps when changing a shared package. For UI changes, inspect responsive layouts and relevant loading, empty, validation, and failure states. For guidance-only changes, check links, skill metadata, Git visibility, and `git diff --check`; app builds are unnecessary. Report checks run and any unresolved failures.
