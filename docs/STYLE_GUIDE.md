# Frontend Style Guide

Hard organizational rules for `blackwell-frontend`, derived from `/Users/paulstevens/Developer/Babeonym/babeonym-frontend` — a sibling app built from the same base template, further along. These are rules, not suggestions: follow them unless a specific ticket discussion decides otherwise (see `docs/TICKETS.md`'s "discuss before building" note), in which case update this doc so the exception is recorded, not silently repeated or forgotten.

---

## 1. Component structure

- **One component per file, one function per file, one file per folder.** This applies beyond components too — hooks, utilities, anything. Each file does one thing; if a file is doing two things, split it. Path for components: `src/components/<Area>/<ComponentName>/<ComponentName>.tsx`. `<Area>` is a feature grouping (e.g. `Header`, `PayPeriodDashboard`), not a component itself.
- **Co-located CSS.** Each component folder gets a `<ComponentName>.css` next to the `.tsx` file, imported by its full `@/` alias path (`@/components/Area/Name/Name.css`) — not a relative `./Name.css` import.
  - **Exception, narrow and specific (2026-07-09):** a component that's a thin wrapper around `Shared/DashboardCard` (or any future shared styled primitive) with no styling of its own skips the `.css` file entirely — nothing to put in it, and an empty unused file is just clutter. This is not "decide per component whether it needs one" — it's still a hard rule, just a narrower one: everything _except_ this specific category still always gets a `.css` file. If a component in this category ever gains real styling of its own, add the file back at that point.
- **CSS hook: `id` for singleton components, `class` for anything that can render more than once per page.** Every component built so far (`Header`, `AppLayout`, `ClientSelector`, ...) renders exactly once per page, so styling them via a fixed `id` selector (`#header { ... }`) is safe. The first multi-instance component (`Shared/DashboardCard`, since several render side-by-side on one page) hit this directly: a hardcoded `id="dashboard-card"` on every instance produced duplicate DOM ids — invalid HTML, breaks anything querying by id. Fix: the component takes a required `id: string` prop (passed by each caller, e.g. `id="client-information-card"`) for genuine per-instance DOM identification, and its own internal shared styling hook uses a `className`, not an `id` — since that styling is identical across every instance, a class is the correct tool, not a workaround.
- **No per-component `index.ts` barrels.** Import the concrete file path directly.
- **Private sub-components nest inside their parent's folder.** If a sub-component is only used by one parent, it lives at `<Parent>/<SubComponent>/<SubComponent>.tsx` inside the parent's own folder — not hoisted to a shared location, even if a similarly-shaped component exists under a different parent. Duplicate rather than couple two unrelated parents to one shared sub-component.
- **Reusable, cross-cutting primitives** (buttons, chips, anything used by more than one feature area) go under `components/Shared/<Name>/<Name>.tsx`, same folder+CSS convention as any other component.
- **Default export the primary thing in every file, wherever possible.** Named exports only when a file genuinely has more than one thing to export (a types file, a barrel, a constants file). This applies to components, hooks, and utility functions alike.
  - Still **name the function itself** even though it's exported as default — `const TopBar = () => {...}; export default TopBar;` (or `export default function TopBar() {...}`), not a bare anonymous `export default () => {...}`. This is about the export mechanism, not about hiding the identifier: a named function still shows up correctly in React DevTools and stack traces, and is still the default export as far as import sites are concerned (`import TopBar from '@/components/.../TopBar'` doesn't care what the local name was). Confirmed — matches the naming convention already used on the backend.

## 2. Props typing

- Component props are typed with a local `type Props = { ... }` declared directly above the component — not `interface`, not exported, unless another file genuinely needs to import that shape.

## 3. State (Context + Reducer, no library)

No Redux/Zustand/TanStack Query — confirmed decision, see `docs/TICKETS.md`. Each state domain gets exactly 4 files under `src/state/<domain>/`:

| File                    | Contents                                                                                                                   |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `<domain>.types.ts`     | `<Domain>State` type, `<Domain>Action` discriminated union                                                                 |
| `<domain>.reducer.ts`   | Pure function: `switch (action.type)`, one case per action, `default: return state`                                        |
| `<domain>.context.ts`   | `createContext<{state, dispatch}>`, plus a `use<Domain>()` hook that throws if called outside its Provider                 |
| `<domain>.provider.tsx` | The Provider component — `useReducer`, a `useMemo`'d context value, and any boot-time side effects (e.g. an initial fetch) |

Providers are composed by nesting in `main.tsx`, outermost-to-innermost in dependency order (a provider that depends on another domain's state nests inside it).

**Context domains are for cross-page state only** (e.g. `selectedClient` — read by the whole app). Data a single page displays lives in **local page state** (`useState` + `useEffect` in the page component), and each page/use case fetches its own purpose-fit data from its own endpoint — even when that means some redundancy with data another page already fetched. Decided 2026-07-09 (Client Summary, ticket 5.1): prefer per-use-case fetches over storing one large response object (like `ClientSummary`) globally and having every consumer parse slices out of it.

**Action types are a controlled-vocab `const`, not a TS `enum` and not bare string literals.** A real TS `enum` is non-erasable syntax and will fail under `erasableSyntaxOnly: true` in `tsconfig.app.json` (the same flag we relaxed only for the generated API client — hand-written app code keeps it on). Instead, `<domain>.types.ts` exports a `const` object with `as const`, and the `<Domain>Action` union references it via `typeof`:

```ts
export const ClientActionType = {
  SET_CLIENTS: 'SET_CLIENTS',
  SELECT_CLIENT: 'SELECT_CLIENT',
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
- **The URL is the source of truth for navigation state — not React state** (decided 2026-07-09). What you're looking at (which client, which pay period) lives in the route path, so refresh, back/forward, and bookmarking all work. Routes are resource-scoped and nested accordingly: `/` (no client / landing), `/client/:clientId` (that client's summary), `/client/:clientId/payPeriod/:payPeriodId` (that pay period's dashboard), etc. **Naming corrected 2026-07-11:** this note originally said kebab-case/plural (`pay-periods`) — nobody recalls deciding that, and it didn't match `ClientPayPeriodCard`'s already-built row links (`payPeriod`, singular, camelCase). Going with what's actually in use rather than the stale note.
- **Don't store the selected resource in a reducer and mutate it on navigation.** The `:clientId` param is the selection; derive the full object from it by looking the id up in the already-fetched list (see `state/client/useSelectedClient.ts` — reads `useParams()`, resolves against the client list in context). A selector like this returns `null` both when there's no param (landing) and when the id matches nothing; expose a separate `loading` flag so callers can tell "list still loading" from "no such resource" and redirect (`<Navigate to="/" replace />`) only in the latter case. Context/reducer state is still fine for things that genuinely aren't navigation (the fetched _list_ of clients, cross-cutting UI state) — just not for "which one is selected."

## 6. Imports

- Cross-directory imports always use the `@/` alias (`@/components/...`, `@/state/...`, `@/api/...`, `@/pages/...`) — never a relative path that climbs more than one directory.
- **MUI components are imported by direct path, not the barrel.** `import Card from "@mui/material/Card"`, not `import { Card } from "@mui/material"`. Decided 2026-07-09: with MUI v7 + Vite/Rollup, both styles produce an equivalent tree-shaken production bundle, so this isn't a bundle-size correctness issue either way — but path imports avoid Vite's dev server having to resolve `@mui/material`'s full barrel (which re-exports the entire library) just to pull out a few components, and it's what the codebase already consistently does. Chosen for consistency, not because the barrel style is wrong — don't waver back and forth once a component uses one style or the other.

## 6a. Shared utility functions

- **`src/utils/<functionName>.ts`, one function per file** — same "one function per file" rule from §1, applied to plain (non-component, non-state) helper functions. Mirrors the backend's own `utils/` convention (e.g. `dateUtils.ts`). First example: `src/utils/formatUTCDateMedium.ts`, extracted 2026-07-09 after a date-formatting helper got written inline inside `ClientHolidaysCard.tsx` — caught immediately because it violated the one-function-per-file rule, and because the formatting logic (UTC-safe date display) wasn't actually holiday-specific at all. **Signal to extract:** if a helper function isn't tied to the specific component/domain it was first written in, it belongs in `utils/`, not inlined — don't wait for a second call site to prove it before moving it, the "is this actually generic" question is usually answerable just by looking at the function.
- **Date formatters are named by their exact output shape, using ICU/CLDR date-style terms** (the same vocabulary `Intl.DateTimeFormat`'s `dateStyle` option uses): `short` = "9/7/26", `medium` = "Sep 7, 2026", `long` = "September 7, 2026", `full` = "Monday, September 7, 2026". So `formatUTCDateMedium`, not a generic `formatDate` or `formatUTCDate` — different displays (e.g. Pay Periods' short-style dates vs. Holidays' medium-style dates) get their own function, own file, correctly named for the one shape each actually produces. Don't build a formatter for a style nothing needs yet — add `formatUTCDateShort.ts` etc. when a real caller needs that shape, same "extract on real need" principle as everything else here.

## 7. Where logic lives

- **The backend does the heavy lifting; the frontend is for interaction.** Presenting data, collecting input, calling endpoints, and rendering results — that's the frontend's job. Calculations, business rules, and validation belong server-side.
- **Don't reimplement backend logic client-side**, even trivial-seeming derivations (e.g. allocation math, hour totals, status derivation). If a card needs a derived value the API doesn't return yet, that's a signal to add/extend a backend endpoint — not a reason to compute it in the UI. We own both repos, so extending the backend is cheap; keeping calculation logic in one place (the backend) is what matters.
- Formatting/presentation-only transforms (e.g. `"06/01 - 06/14"` → localized date display, currency formatting) are fine client-side — the line is business logic vs. display logic, not "any computation at all."

## 8. Async UX baseline

Spartan, but not broken — every control that triggers an async/API action must:

- **Disable itself while the request is in flight**, to prevent double-submission (e.g. double-clicking "Create Pay Period" firing two creates).
- **Show a loading indicator** during the request — an inline spinner or MUI's button loading state is enough, no need for anything fancier.

This applies everywhere a button calls the API: Create Pay Period, Generate Timesheets, Write Allocation Report, Generate Payroll Report, generate/regenerate Allocation Report, Close Pay Period, and any expense-field save. Minimal is fine; leaving the user unsure whether their click registered is not.

**Unsaved in-progress input gets a navigation blocker, not friction on the things that cause navigation.** Decided 2026-07-09, discussing whether the client selector needed a confirm-select step to avoid accidental client switches losing in-progress data entry. Rejected in favor of: pages with unsaved input (typed-but-not-saved form fields) use React Router's `useBlocker` to prompt before leaving — covers _every_ exit path (client switch, back button, other nav links), not just one. Everywhere else, navigation stays instant. Don't add confirm-before-navigate steps to navigation controls themselves (selectors, links, drawer items) — that punishes every use to guard a risk that only exists on specific pages.

## 9. Theming

- **Build the theming _architecture_ now, even though there's only one theme today.** Mirror Babeonym's structure: `src/themes/{types.theme.ts, themeRegistry.ts, themes/<name>.theme.ts, ...}`, a `themeRegistry` map, `ThemeProvider` fed from the registry — not a bare inline `createTheme()` call like the current template stub has.
- **The one theme registered today should be default MUI styling** — no custom palette/typography/spacing beyond what's needed to satisfy the architecture (e.g. `light: createTheme({})` or close to it). The point of building the scaffold now is that swapping in a real custom theme later is a contained change, not a rewrite — not that we're designing a custom look today.

## 10. Formatting

- Prettier config matches Babeonym exactly (`.prettierrc`): `singleQuote: true, semi: true, trailingComma: "es5", printWidth: 150`. `.prettierignore` excludes `dist` and `src/api/generated` (vendored, never hand-edited, regenerated wholesale anyway).
- **Verification must include `npm run format:check` (or `npm run format` to fix), not just `npm run lint`.** `eslint-config-prettier` (already in `eslint.config.js`) only _disables_ ESLint rules that would conflict with Prettier — it does not run Prettier or enforce its formatting. A clean `eslint .` says nothing about whether Prettier's formatting is actually being followed. Discovered 2026-07-09 after a full session of writing double-quoted strings despite `singleQuote: true` in `.prettierrc`, with `eslint .` passing the whole time. `package.json` has `lint`, `format`, and `format:check` scripts now — use them; don't reconstruct an ad hoc check list from memory each session.

## 11. Testing

- **Not every component gets a test — test what earns it, not everything uniformly.** Same "test what earns its keep" judgment the backend already applies (`ARCHITECTURE.md` explicitly skips one cache-invalidation test as disproportionate to its mocking cost) — applied here to components instead of services. Core principle (Testing Library's own stated philosophy): test _behavior_ (what renders, what happens on interaction), not _implementation_ (internal state, whether some function got called).

  **Worth testing:**
  - Anything with **branching** — multiple distinct render outcomes depending on props/state (e.g. `ClientSummary.tsx`: loading / error / redirect-on-invalid-id / loaded are four independently-breakable behaviors).
  - Anything with **computation** — filtering, deriving, transforming data (e.g. `ClientEmployeesCard`'s active-employee filter has a real failure mode: wrong enum value, off-by-one).
  - **Shared/reused primitives** — a bug in `Shared/DashboardCard` potentially breaks every card wrapping it; higher leverage to test once than hope every consumer catches it.
  - **Pure functions, especially reducers** — cheapest, highest-value tests possible: no DOM, no mocking, just inputs → outputs.
  - **Anything async** — loading/error states are exactly what silently breaks (unhandled rejection, wrong condition) and are hard to catch just by eyeballing the running app.

  **Not worth testing (or barely):**
  - Pure prop-passthrough components with zero logic (e.g. `ClientInformationCard` — just renders what it's given, no branching). A test would just restate the implementation, and a break is visible in two seconds of looking at the page.

- **Tests are co-located**, not in a separate mirrored folder — `ComponentName.test.tsx` next to `ComponentName.tsx`. This matches the component-folder convention (§1: everything about a component lives together) and standard React/Vite practice. This is a deliberate difference from the _backend's_ `tests/unit/` + `tests/integration/` split — that split exists there because integration tests hit a live, rate-limited API and must run separately/sequentially; the frontend has no equivalent live-API tier (everything talks to a mocked API client in tests), so there's nothing to physically separate.
- **Shared test infrastructure lives in `src/test/`**: `src/test/setup.ts` (existing, global RTL/jsdom setup), `src/test/fixtures/<name>.ts` (reusable fake API response data, one file per resource, default-exported), `src/test/renderWithProviders.tsx` (wraps RTL's `render` in the full app provider tree — `ThemeProvider` + `CssBaseline` + every state domain's Provider, nested the same way `main.tsx` nests them). Use `renderWithProviders` instead of RTL's bare `render` for anything that needs those contexts — and when a new state domain's Provider is added to `main.tsx`, add it to `renderWithProviders` too, in the same position.
- **Mocking API calls**: any code path under test that goes through `src/api/client.ts` (directly, or indirectly via a state provider's boot-time fetch) must have that call mocked — tests never hit a real backend. Mock only the specific API instance(s) actually used, via `vi.mock`:

  ```ts
  vi.mock('@/api/client', () => ({
    clientApi: {
      v1GetClients: vi.fn(),
    },
  }));
  ```

  **Keep the mock factory free of outside references.** `vi.mock()` calls are hoisted above regular `import` statements, so referencing an imported fixture (or any other top-level `const`) _inside the factory_ throws a "Cannot access before initialization" error — the factory runs before those imports are linked. Instead, leave the factory bare (`vi.fn()` with no preset return value) and configure the return value inside the test body, using `vi.mocked()`, where imports are already resolved:

  ```ts
  import mockClients from '@/test/fixtures/clients';
  import { clientApi } from '@/api/client';

  test('...', async () => {
    vi.mocked(clientApi.v1GetClients).mockResolvedValue(mockClients);
    // render + assert
  });
  ```

  (The backend's equivalent convention documents `vi.hoisted()` as the fix for this same hoisting problem — that works too, but only for data declared inline in the same file. Since our fixtures live in their own reusable files under `src/test/fixtures/`, configuring the mock in the test body is the simpler option here.)

- Use `screen.findBy...` (async) rather than `getBy...` when the component's initial render depends on a boot-time fetch resolving, to avoid `act()` warnings from the state update landing after the test's synchronous assertions.

---

## Flagged, not yet decided

None currently — all items raised so far have been resolved. New ones get added here as they come up.
