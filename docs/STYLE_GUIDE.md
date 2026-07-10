# Frontend Style Guide

Hard organizational rules for `blackwell-frontend`, derived from `/Users/paulstevens/Developer/Babeonym/babeonym-frontend` — a sibling app built from the same base template, further along. These are rules, not suggestions: follow them unless a specific ticket discussion decides otherwise (see `docs/TICKETS.md`'s "discuss before building" note), in which case update this doc so the exception is recorded, not silently repeated or forgotten.

---

## 1. Component structure

- **One component per file, one function per file, one file per folder.** This applies beyond components too — hooks, utilities, anything. Each file does one thing; if a file is doing two things, split it. Path for components: `src/components/<Area>/<ComponentName>/<ComponentName>.tsx`. `<Area>` is a feature grouping (e.g. `Header`, `PayPeriodDashboard`), not a component itself.
- **Co-located CSS.** Each component folder gets a `<ComponentName>.css` next to the `.tsx` file, imported by its full `@/` alias path (`@/components/Area/Name/Name.css`) — not a relative `./Name.css` import.
- **No per-component `index.ts` barrels.** Import the concrete file path directly.
- **Private sub-components nest inside their parent's folder.** If a sub-component is only used by one parent, it lives at `<Parent>/<SubComponent>/<SubComponent>.tsx` inside the parent's own folder — not hoisted to a shared location, even if a similarly-shaped component exists under a different parent. Duplicate rather than couple two unrelated parents to one shared sub-component.
- **Reusable, cross-cutting primitives** (buttons, chips, anything used by more than one feature area) go under `components/Shared/<Name>/<Name>.tsx`, same folder+CSS convention as any other component.
- **Default export the primary thing in every file, wherever possible.** Named exports only when a file genuinely has more than one thing to export (a types file, a barrel, a constants file). This applies to components, hooks, and utility functions alike.
  - Still **name the function itself** even though it's exported as default — `const TopBar = () => {...}; export default TopBar;` (or `export default function TopBar() {...}`), not a bare anonymous `export default () => {...}`. This is about the export mechanism, not about hiding the identifier: a named function still shows up correctly in React DevTools and stack traces, and is still the default export as far as import sites are concerned (`import TopBar from '@/components/.../TopBar'` doesn't care what the local name was). Confirmed — matches the naming convention already used on the backend.

## 2. Props typing

- Component props are typed with a local `type Props = { ... }` declared directly above the component — not `interface`, not exported, unless another file genuinely needs to import that shape.

## 3. State (Context + Reducer, no library)

No Redux/Zustand/TanStack Query — confirmed decision, see `docs/TICKETS.md`. Each state domain gets exactly 4 files under `src/state/<domain>/`:

| File | Contents |
|---|---|
| `<domain>.types.ts` | `<Domain>State` type, `<Domain>Action` discriminated union |
| `<domain>.reducer.ts` | Pure function: `switch (action.type)`, one case per action, `default: return state` |
| `<domain>.context.ts` | `createContext<{state, dispatch}>`, plus a `use<Domain>()` hook that throws if called outside its Provider |
| `<domain>.provider.tsx` | The Provider component — `useReducer`, a `useMemo`'d context value, and any boot-time side effects (e.g. an initial fetch) |

Providers are composed by nesting in `main.tsx`, outermost-to-innermost in dependency order (a provider that depends on another domain's state nests inside it).

**Action types are a controlled-vocab `const`, not a TS `enum` and not bare string literals.** A real TS `enum` is non-erasable syntax and will fail under `erasableSyntaxOnly: true` in `tsconfig.app.json` (the same flag we relaxed only for the generated API client — hand-written app code keeps it on). Instead, `<domain>.types.ts` exports a `const` object with `as const`, and the `<Domain>Action` union references it via `typeof`:

```ts
export const ClientActionType = {
  SET_CLIENTS: "SET_CLIENTS",
  SELECT_CLIENT: "SELECT_CLIENT",
} as const;

export type ClientAction =
  | { type: typeof ClientActionType.SET_CLIENTS; payload: Client[] }
  | { type: typeof ClientActionType.SELECT_CLIENT; payload: Client | null };
```

The reducer's `switch` and every `dispatch(...)` call site reference `ClientActionType.X`, never the bare string — this also matches the backend's own "controlled-vocab const" convention for enums (`docs/ARCHITECTURE.md`). It's not primarily about type safety (the discriminated union already catches a typo'd literal at compile time) — it's about not retyping the same string across 3+ files and getting real rename/refactor support.

## 4. API client

- Generated client lives in `src/api/generated/` — never hand-edited, regenerated via `npm run api:gen`.
- `src/api/client.ts` builds exactly **one** `Configuration` and exports **one API-class instance per OpenAPI tag** (e.g. `export const clientApi = new ClientApi(config)`, `export const payPeriodApi = new PayPeriodApi(config)`).
- `src/api/index.ts` is a barrel: `export * from './client'` — nothing else goes in it.
- Base URL comes from a Vite env var. **Must be prefixed `VITE_`** (e.g. `VITE_API_BASE_URL`) or explicitly added to `envPrefix` in `vite.config.ts` — Babeonym's `.env` uses an unprefixed `API_BASE_URL`, which Vite does not expose to client code by default. Don't replicate that; it's a bug in the reference project, not a convention.

## 5. Routing / pages / layout

- `src/router.tsx` owns the full route tree (`createBrowserRouter`), kept separate from `App.tsx`.
- `src/AppLayout.tsx` (+ co-located `AppLayout.css`) is the one persistent shell component (app bar/drawer + `<Outlet/>`) — lives at `src/` root, not nested inside `components/`.
- Route-level page components live flat under `src/pages/<PageName>.tsx` — no further nesting, no folder-per-page (contrast with rule 1, which is for `components/`, not `pages/`).

## 6. Imports

- Cross-directory imports always use the `@/` alias (`@/components/...`, `@/state/...`, `@/api/...`, `@/pages/...`) — never a relative path that climbs more than one directory.

## 7. Where logic lives

- **The backend does the heavy lifting; the frontend is for interaction.** Presenting data, collecting input, calling endpoints, and rendering results — that's the frontend's job. Calculations, business rules, and validation belong server-side.
- **Don't reimplement backend logic client-side**, even trivial-seeming derivations (e.g. allocation math, hour totals, status derivation). If a card needs a derived value the API doesn't return yet, that's a signal to add/extend a backend endpoint — not a reason to compute it in the UI. We own both repos, so extending the backend is cheap; keeping calculation logic in one place (the backend) is what matters.
- Formatting/presentation-only transforms (e.g. `"06/01 - 06/14"` → localized date display, currency formatting) are fine client-side — the line is business logic vs. display logic, not "any computation at all."

## 8. Async UX baseline

Spartan, but not broken — every control that triggers an async/API action must:
- **Disable itself while the request is in flight**, to prevent double-submission (e.g. double-clicking "Create Pay Period" firing two creates).
- **Show a loading indicator** during the request — an inline spinner or MUI's button loading state is enough, no need for anything fancier.

This applies everywhere a button calls the API: Create Pay Period, Generate Timesheets, Write Allocation Report, Generate Payroll Report, generate/regenerate Allocation Report, Close Pay Period, and any expense-field save. Minimal is fine; leaving the user unsure whether their click registered is not.

## 9. Theming

- **Build the theming *architecture* now, even though there's only one theme today.** Mirror Babeonym's structure: `src/themes/{types.theme.ts, themeRegistry.ts, themes/<name>.theme.ts, ...}`, a `themeRegistry` map, `ThemeProvider` fed from the registry — not a bare inline `createTheme()` call like the current template stub has.
- **The one theme registered today should be default MUI styling** — no custom palette/typography/spacing beyond what's needed to satisfy the architecture (e.g. `light: createTheme({})` or close to it). The point of building the scaffold now is that swapping in a real custom theme later is a contained change, not a rewrite — not that we're designing a custom look today.

## 10. Formatting

- Prettier config matches Babeonym exactly (`.prettierrc`): `singleQuote: true, semi: true, trailingComma: "es5", printWidth: 150`.

## 11. Testing

- **Tests are co-located**, not in a separate mirrored folder — `ComponentName.test.tsx` next to `ComponentName.tsx`. This matches the component-folder convention (§1: everything about a component lives together) and standard React/Vite practice. This is a deliberate difference from the *backend's* `tests/unit/` + `tests/integration/` split — that split exists there because integration tests hit a live, rate-limited API and must run separately/sequentially; the frontend has no equivalent live-API tier (everything talks to a mocked API client in tests), so there's nothing to physically separate.
- **Shared test infrastructure lives in `src/test/`**: `src/test/setup.ts` (existing, global RTL/jsdom setup), `src/test/fixtures/<name>.ts` (reusable fake API response data, one file per resource, default-exported), `src/test/renderWithProviders.tsx` (wraps RTL's `render` in the full app provider tree — `ThemeProvider` + `CssBaseline` + every state domain's Provider, nested the same way `main.tsx` nests them). Use `renderWithProviders` instead of RTL's bare `render` for anything that needs those contexts — and when a new state domain's Provider is added to `main.tsx`, add it to `renderWithProviders` too, in the same position.
- **Mocking API calls**: any code path under test that goes through `src/api/client.ts` (directly, or indirectly via a state provider's boot-time fetch) must have that call mocked — tests never hit a real backend. Mock only the specific API instance(s) actually used, via `vi.mock`:

  ```ts
  vi.mock("@/api/client", () => ({
    clientApi: {
      v1GetClients: vi.fn(),
    },
  }));
  ```

  **Keep the mock factory free of outside references.** `vi.mock()` calls are hoisted above regular `import` statements, so referencing an imported fixture (or any other top-level `const`) *inside the factory* throws a "Cannot access before initialization" error — the factory runs before those imports are linked. Instead, leave the factory bare (`vi.fn()` with no preset return value) and configure the return value inside the test body, using `vi.mocked()`, where imports are already resolved:

  ```ts
  import mockClients from "@/test/fixtures/clients";
  import { clientApi } from "@/api/client";

  test("...", async () => {
    vi.mocked(clientApi.v1GetClients).mockResolvedValue(mockClients);
    // render + assert
  });
  ```

  (The backend's equivalent convention documents `vi.hoisted()` as the fix for this same hoisting problem — that works too, but only for data declared inline in the same file. Since our fixtures live in their own reusable files under `src/test/fixtures/`, configuring the mock in the test body is the simpler option here.)
- Use `screen.findBy...` (async) rather than `getBy...` when the component's initial render depends on a boot-time fetch resolving, to avoid `act()` warnings from the state update landing after the test's synchronous assertions.

---

## Flagged, not yet decided

None currently — all items raised so far have been resolved. New ones get added here as they come up.
