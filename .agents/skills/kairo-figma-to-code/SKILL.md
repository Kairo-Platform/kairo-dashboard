---
name: kairo-figma-to-code
description: >-
  Implements Figma designs into the Kairo dashboard monorepo using existing
  @kairo/ui components, styled-components, and theme tokens. Use when the user
  shares a figma.com URL, asks to implement/build/port a Figma screen, or wants
  design-to-code for kairo-admin-dashboard or kairo-enterprise-dashboard.
---

# Kairo Figma → Code

Use this repository specialization alongside the Figma integration guidance available in the current agent environment.

## Mandatory order

1. Read the available Figma integration/design-to-code guidance, if provided.
2. Use the available Figma design-context tool with the file key and node ID from the URL; inspect a screenshot for visual comparison. Use only parameters supported by the installed tool. If the design cannot be accessed, report the gap and use supplied design evidence without claiming fidelity you could not verify.
3. Read the **target file(s) the user already started** before writing.
4. Search `@kairo/ui`, `@kairo/ui/inputs`, `@kairo/lib`, `@kairo/theme` for matches.
5. Implement by **completing existing structure**, not rewriting from Tailwind.

## Stack (non-negotiable)

| Do                                                               | Don't                                                        |
| ---------------------------------------------------------------- | ------------------------------------------------------------ |
| `styled-components` + `theme.colors.*`                           | Paste Figma Tailwind / install Tailwind                      |
| `@kairo/ui` primitives                                           | Rebuild Button, Modal, Flex, Divider, etc.                   |
| `@iconify/react` `Icon` when the app already uses Iconify        | Commit expiring `figma.com/api/mcp/asset/...` URLs for icons |
| BEM-ish classes already in the file (`.MessageContent`, `__row`) | Invent a parallel class system                               |
| Dummy data when the screen is UI-only                            | Fake API clients or half-wired stores                        |

## Reuse map (check these first)

**Layout / chrome:** `Flex`, `Button` + `ButtonClass` / `ButtonSize`, `Modal`, `Drawer`, `EmptyState`, `ActionMenu`, `Divider`, `Tabs` / `Tab`, `Table`, `Pagination`, `Breadcrumbs`

**People / status:** `InitialsAvatar`, `Tag`, status icons

**Forms:** `@kairo/ui/inputs` → `FormInput`, `FileInput`, `SelectDropdown`, `DatePickerInputV2`, etc.

**Shared utils:** `@kairo/lib/utils` (dates, `ICONS`, helpers)

**Tokens:** `packages/theme/src/tokens.ts` — prefer semantic keys over raw hex:

- Brand / primary → `orange` / `primaryColor` (`#FF6B1A`)
- Surfaces / borders → `gray_02`, `white`
- Body text → `text_01`; muted → `text_02`
- Success / channel green → `green` / `green_01`

## Implementation pattern

### 1. Preserve the shell

If the user laid out sections (headers, empty `MessageContent`, `ConversationInfo`, etc.):

- Keep their JSX skeleton and class names.
- Fill the empty regions.
- Extend the existing `styled.*` block instead of replacing the component.

### 2. Translate Figma → tokens

Map Figma variables / hex from `get_design_context` into theme keys. Example:

- `#ff6b1a` / brand-500 → `theme.colors.orange`
- `#f5f5f5` / stroke-light → `theme.colors.gray_02`
- `#1a1a1a` / body → `theme.colors.text_01`
- `#797979` / `#a2a2a2` helpers → `theme.colors.text_02`
- `#00bf06` → `theme.colors.green`

### 3. Absolute Figma layouts → flex/grid

Figma MCP often returns absolute positioning. Rebuild with:

- CSS grid / flex (match nearby pages)
- `gap`, padding, border-radius from the screenshot + node spacing
- Responsive breakpoints via `theme.breakpoint.*` when the page already does

### 4. Icons

Prefer:

```tsx
import { Icon } from "@iconify/react";
<Icon icon="tabler:send" width={20} height={20} />;
```

Use Figma-exported assets only for unique illustrations/brand marks not available in Iconify. If committing assets, download bytes into the app `public/` tree — never leave MCP asset URLs in committed code.

### 5. Dummy data

When the user asks for UI / dummy content:

- Colocate typed dummy constants near the component (or page props).
- Mirror real field names the API will likely use later (`id`, `sender`, `time`, etc.).
- Wire list → details navigation with stable dummy ids.

### 6. Pixel-perfect checklist

Before finishing:

- [ ] Screenshot vs implementation: alignment (left/right bubbles, sidebar sections)
- [ ] Colors use theme tokens, not hardcoded one-offs (except rare one-time accents)
- [ ] Existing reusable components used wherever intent matches
- [ ] No Tailwind classes left in the diff
- [ ] User’s pre-existing structure and imports preserved where possible
- [ ] Typecheck-friendly props; no `as any` unless unavoidable

## Optional design context

Use any supplied context below; inspect the repository to fill routine gaps:

1. Figma URL with `node-id`
2. Target file path(s)
3. Which sections to fill
4. Color/placement rules in product language (`gray_02`, `text_01`, agents right, …)
5. Dummy copy when APIs aren’t ready

## Project-wide conventions

Follow [the engineering rules](../../rules/engineering.md) for comments, service structure, stores, notifications, and validation.

## Out of scope

- Writing designs **into** Figma (use the available Figma authoring workflow)
- Creating new design-system primitives without asking
- Dark-theme one-offs unless the target surface already uses them
