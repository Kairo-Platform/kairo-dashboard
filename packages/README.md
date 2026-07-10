# Shared packages

| Package | Purpose |
|---------|---------|
| `@kairo/config-typescript` | Base and Next.js TypeScript configs |
| `@kairo/config-eslint` | Shared ESLint config for Next apps and libraries |
| `@kairo/services` | `generateService` HTTP factory |
| `@kairo/theme` | Theme tokens, `KairoTheme`, `StyledRegistry`, global styles |
| `@kairo/ui` | Design system components and form inputs |
| `@kairo/hooks` | Shared React hooks (`useModal`, `usePagination`, etc.) |
| `@kairo/utils` | Shared utilities and notification helpers |
| `@kairo/auth` | Cookie/session primitives (not unified auth flows) |

## Extraction roadmap

Move code here incrementally when shared across apps:

1. ~~`packages/theme`~~ — done
2. ~~`packages/ui`~~ — done (domain-specific tags remain in each app)
3. ~~`packages/hooks`~~ — done (app-specific hooks remain in each app)
4. ~~`packages/utils`~~ — partial (core shared utils extracted)

Keep app-specific services, auth flows, BFF routes, and domain components inside each app.
