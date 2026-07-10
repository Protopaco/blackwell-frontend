# BlackwellTime Frontend — Ticket Board

Working ticket list for building the frontend described in the backend's `docs/UI.md`, cross-referenced against `docs/openapi.json`. Structured like a kanban board: grouped by phase (the real dependency structure), each ticket carries a `Status` you flip as work happens.

**Status values**: `Backlog` (upstream dependency not done) → `Ready` (dependencies met, safe to start a fresh session on it) → `In Progress` → `Done`.

Intended workflow: one ticket per conversation/session, to keep each session focused and avoid one giant thread. Update this file's Status column as tickets move.

**Before writing any code on a ticket**: discuss and resolve its open UI/UX/implementation questions first (e.g. is the client selector a dropdown or a searchable field, exact card layout, etc.) and get explicit go-ahead. Do not start implementing on assumptions — surface the question, wait for an answer, then build.

**Never mark a ticket `Done` without explicit approval.** When implementation finishes, report what was built and leave the Status as `In Progress` (or similar) until the user reviews and says to mark it `Done` — don't self-approve.

**Reference project**: `/Users/paulstevens/Developer/Babeonym/babeonym-frontend` is a sibling app built from the same base template, more fleshed out. Its organizational conventions have been codified as hard rules in `docs/STYLE_GUIDE.md` — read that before starting any ticket that touches component structure, state, or API wiring. It also has a "flagged, not yet decided" section (anonymous default exports, multi-theme system, Prettier settings) to resolve as we go.

## Known open item (not a blocker)

Google Sign-In is in the UI spec's app bar, but auth isn't built on the backend yet (project order is BE → FE → DB → Auth). Ticket 2 below stubs/mocks the signed-in state instead of building real auth — revisit once backend auth lands.

---

## Phase 0 — Foundation

| # | Ticket | Status | Depends on | Backend endpoint(s) | Notes |
|---|---|---|---|---|---|
| 1 | Generate typed API client | Done | — | N/A (uses full `openapi.json`) | Point `api:gen` at the **live running backend** (`http://localhost:3000/openapi.json`, matching Babeonym's convention) rather than a static local file — confirmed backend already serves this at `GET /openapi.json` (`src/app.ts:34`). No copy-pasting the spec file; regenerating always reflects whatever the running backend currently returns. URL will need to become environment-configurable later (dev/prod servers), not just hardcoded localhost. Base URL for the actual API client (`src/api/client.ts`) must use a `VITE_`-prefixed env var per `STYLE_GUIDE.md` §4. |
| 2 | App shell — AppBar + mocked auth + routing skeleton | Done | — | N/A | Persistent AppBar (`src/App.tsx` currently has just one stub route). Client-selector slot is a placeholder here, wired for real in #3. Top-right: mocked signed-in state (hardcoded first name + no-op Sign Out button) — see "Known open item" above. Add top-level route structure distinguishing "no client selected" vs "client selected" layouts. |
| 3 | Client selection state | Done | #1, #2 | `GET /api/v1/client` | Dropdown/selector wired into the AppBar slot from #2. Holds selected client in context/hook. Drives switch between "No Client Selected" landing page (no drawer) and "Client Selected" layout (drawer + Client Summary). |
| 4 | Left drawer (client nav) | Deferred (2026-07-09) | #5.x | N/A | Navigation decision postponed until the Client Summary page (#5.1–5.8) is built and can be looked at. Options on the table: make the summary cards themselves the links into each config area (no drawer), keep the drawer as spec'd in `docs/UI.md`, or both. Context for the eventual decision: config pages (Employees, Holidays, etc.) are coming later as trivial get/set forms — build for tomorrow's state; a drawer today would be one live link (Pay Periods) plus six greyed-out stubs. |

---

## Phase 1 — Client Summary

Split from one ticket into a page shell + one ticket per card (approved 2026-07-09). Data flow: the page fetches `GET /client/{clientId}/summary` **once**; cards are presentational and receive their slice as props — no per-card fetching. Cards are **display-only for now** — whether they become links into each config area (vs. a drawer, vs. both) is deliberately undecided until the page can be looked at (see #4). Each card's exact design (count vs. list, which fields) is decided per-card at build time — not pre-designed here.

| # | Ticket | Status | Depends on | Backend endpoint(s) | Notes |
|---|---|---|---|---|---|
| 5.1 | Client Summary page + route (shell) | Done | #3 | `GET /api/v1/client/{clientId}/summary` | Page component, route wiring, the single summary fetch, layout the cards slot into. Approved: summary data lives in local page state, not a context domain (see `STYLE_GUIDE.md` §3). **URL is now source of truth for client selection** (approved 2026-07-09): route is `/client/:clientId`, `selectedClient` removed from reducer, derived from the URL via `state/client/useSelectedClient.ts` — survives refresh/bookmarking (see `STYLE_GUIDE.md` §5). |
| 5.2 | Client Information card | In Progress | #5.1 | N/A — uses `selectedClient`, not #5.1's summary fetch | ClientName, ClientCode. **Correction (2026-07-09): does not depend on the `ClientSummary` fetch** — `clientName`/`clientCode` live on the `Client` object (`GET /client` list, already resolved via `useSelectedClient()`), not on `ClientSummary`'s response. Renders as soon as a client is selected. |
| 5.3 | Employees card | Backlog | #5.1 | (data from #5.1's fetch) | Likely a count of active employees — confirm at build time. |
| 5.4 | Supervisors card | Backlog | #5.1 | (data from #5.1's fetch) | Supervisors — count vs. list decided at build time. |
| 5.5 | Activities card | Backlog | #5.1 | (data from #5.1's fetch) | Activities — count vs. list decided at build time. |
| 5.6 | Funding Sources card | Backlog | #5.1 | (data from #5.1's fetch) | Funding sources — count vs. list decided at build time. |
| 5.7 | Holidays card | Backlog | #5.1 | (data from #5.1's fetch) | Holidays — likely name + date list, confirm at build time. |
| 5.8 | Settings card | Backlog | #5.1 | (data from #5.1's fetch) | The three settings values: time input method, pay period interval, pay period start date. |

---

## Phase 2 — Pay Periods Index

| # | Ticket | Status | Depends on | Backend endpoint(s) | Notes |
|---|---|---|---|---|---|
| 6 | Pay Periods Index page | Backlog | #3 | `GET /api/v1/payPeriod/{clientId}` | Reverse-chronological list, each row shows Pay Period Name + Status. Row click navigates to the Dashboard route (route can point at a stub until #8 exists). **Dependency updated (2026-07-09): no longer depends on #4** (drawer deferred — see #4). Reached via its own route; how users navigate here (drawer link vs. a card/button on Client Summary) is part of the deferred #4 decision. |
| 7 | Create Pay Period modal | Backlog | #6 | `GET /api/v1/payPeriod/{clientId}/next`, `POST /api/v1/payPeriod/{clientId}` | Confirmation modal only — no user-configurable fields. Shows Name/Start/End from the `next`-suggested pay period, Create button posts it, then refreshes the index list. |

---

## Phase 3 — Pay Period Dashboard shell

| # | Ticket | Status | Depends on | Backend endpoint(s) | Notes |
|---|---|---|---|---|---|
| 8 | Dashboard shell | Backlog | #6 | `GET /api/v1/payPeriod/{clientId}/{payPeriodId}` | Route + layout holding 4 card slots. Fetches base pay period data. Cards themselves are built in Phase 4 — this ticket is just the container. |

---

## Phase 4 — Dashboard cards

Each card is independent of the others (no live/reactive data-sharing between cards — everything is button-triggered: press button, call API, re-render with the response). Parallelizable once #8 exists.

| # | Ticket | Status | Depends on | Backend endpoint(s) | Notes |
|---|---|---|---|---|---|
| 9 | Card 1 — Pay Period Info | Backlog | #8 | `GET /api/v1/payPeriod/{clientId}/{payPeriodId}` | Display-only: name, start/end dates, status. Can likely reuse the fetch from #8 rather than re-fetching. |
| 10 | Card 2 — Employee Timesheet Status | Backlog | #8 | `GET /api/v1/timesheet/status/{clientId}/{payPeriodId}`, `GET`/`PUT /api/v1/payrollReport/{clientId}/{payPeriodId}/employee-expenses`, `POST /api/v1/timesheet/{clientId}/{payPeriodId}/generate`, `POST /api/v1/payrollReport/{clientId}/{payPeriodId}/allocation-report` | Largest card — per-employee row (name, 5-state status, Include/Ignore toggle, Total Expense field), plus "Generate Timesheets" (always enabled) and "Write Allocation Report" (enabled once all included employees have Total Expense entered) buttons. Flagged as a likely candidate to split into sub-tickets once we're actually in it — decide at build time, not now. **Unsaved-changes guard (decided 2026-07-09):** this is the first page with unsaved in-progress input (Total Expense fields typed but not yet saved). Add a navigation blocker (React Router `useBlocker`) scoped to this page — prompts before leaving (client switch, back button, any nav) only when there's something unsaved. Chosen over adding a confirm-select step to the client selector itself, which would add friction to every switch (including the common, deliberate case) to guard a risk that doesn't exist on any page before this one. |
| 11 | Card 3 — Payroll Report | Backlog | #8 | `GET`/`POST /api/v1/payrollReport/{clientId}/{payPeriodId}`, generate: `POST /api/v1/payrollReport/{clientId}/{payPeriodId}/generate` | "Generate Payroll Report" button (re-runnable). In-app report display is explicitly design-TBD in `docs/UI.md` (modal vs. separate page) — needs real research before this ticket starts, not just a UI-layout decision: the report's values need to be copied from this app into another (external) app, so the display format has to support that workflow (e.g. easy copy/paste, exportable table, CSV — not yet known which). Also note: there's no explicit "payroll report status" field in the API response — FE will need to infer generated/not-generated state from data presence, decide the exact approach in this ticket. |
| 12 | Card 4 — Allocation Report | Backlog | #8 | `GET`/`POST /api/v1/payrollReport/{clientId}/{payPeriodId}/allocation-report`, `GET`/`PUT /api/v1/payrollReport/{clientId}/{payPeriodId}/additional-expenses`, `PATCH /api/v1/payPeriod/{clientId}/{payPeriodId}/close` | Funding-source allocation display, org-level additional-expense fields (distributed proportionally by the backend), and "Close Pay Period" button (enabled once the allocation report has been generated). Also has unsaved in-progress input (additional-expense fields) — apply the same navigation-blocker pattern as #10. |

---

## Future / not yet scheduled

| Ticket | Notes |
|---|---|
| Per-client accent color | Idea (2026-07-09): give each client a distinct color, applied as the accent/primary color once that client is selected (app bar, possibly card accents) — an instant visual cue for which client you're on, catches "wrong client" mistakes. **Approach not yet decided**, two options on the table: (1) stored field on `Client` (`clientColor` added to the `Clients` sheet/schema, backend + FE change, curatable but needs manual data entry per client and someone remembering to set it) — user has confirmed the schema change itself is low-effort if this path is chosen; (2) derived deterministically from `clientId` (hash → HSL color, constrained saturation/lightness band for legible contrast, zero backend change, automatic for every client including existing ones, but not hand-curatable). Leaning #2 in discussion but not settled — user wants to understand the hashing approach better before deciding. No urgency — option 2 has no schema dependency so there's no cost to deciding late; only option 1 would benefit from earlier commitment. Low-cost prep in the meantime: style new components (e.g. `DashboardCard`) using `theme.palette.primary.main` rather than hardcoded colors, so either approach slots in later with no rework. |

---

## Decisions already made (so we don't re-litigate them)

- **State management**: no new library. Plain React state/hooks (`useState`/`useContext`) — the app is button-triggered throughout, not live/reactive, so there's no need for TanStack Query/Redux/etc.
- **Logging**: skipped. This is a small internal tool for a small company, not a public-facing product — no automated error-tracking/observability layer planned.
- **Auth**: mocked/stubbed only (see "Known open item" above) until backend auth work begins.
