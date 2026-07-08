# BlackwellTime Frontend — Ticket Board

Working ticket list for building the frontend described in the backend's `docs/UI.md`, cross-referenced against `docs/openapi.json`. Structured like a kanban board: grouped by phase (the real dependency structure), each ticket carries a `Status` you flip as work happens.

**Status values**: `Backlog` (upstream dependency not done) → `Ready` (dependencies met, safe to start a fresh session on it) → `In Progress` → `Done`.

Intended workflow: one ticket per conversation/session, to keep each session focused and avoid one giant thread. Update this file's Status column as tickets move.

## Known open item (not a blocker)

Google Sign-In is in the UI spec's app bar, but auth isn't built on the backend yet (project order is BE → FE → DB → Auth). Ticket 2 below stubs/mocks the signed-in state instead of building real auth — revisit once backend auth lands.

---

## Phase 0 — Foundation

| # | Ticket | Status | Depends on | Backend endpoint(s) | Notes |
|---|---|---|---|---|---|
| 1 | Generate typed API client | Ready | — | N/A (uses full `openapi.json`) | Copy backend's `docs/openapi.json` into `blackwell-frontend/openapi/openapi.json` (replacing the placeholder), run `npm run api:gen` to generate the typescript-fetch client into `src/api/generated`, replace the stub in `src/api/client.ts` with a real client wired to a configurable base URL (Vite env var). |
| 2 | App shell — AppBar + mocked auth + routing skeleton | Ready | — | N/A | Persistent AppBar (`src/App.tsx` currently has just one stub route). Client-selector slot is a placeholder here, wired for real in #3. Top-right: mocked signed-in state (hardcoded first name + no-op Sign Out button) — see "Known open item" above. Add top-level route structure distinguishing "no client selected" vs "client selected" layouts. |
| 3 | Client selection state | Backlog | #1, #2 | `GET /api/v1/client` | Dropdown/selector wired into the AppBar slot from #2. Holds selected client in context/hook. Drives switch between "No Client Selected" landing page (no drawer) and "Client Selected" layout (drawer + Client Summary). |
| 4 | Left drawer (client nav) | Backlog | #3 | N/A | Nav items: Pay Periods (active, links to Phase 2), Employees/Supervisors/Funding Sources/Activities/Holidays/Settings (visibly greyed out, non-functional — future work per `docs/UI.md`). Only renders when a client is selected. |

---

## Phase 1 — Client Summary

| # | Ticket | Status | Depends on | Backend endpoint(s) | Notes |
|---|---|---|---|---|---|
| 5 | Client Summary page | Backlog | #3 | `GET /api/v1/client/{clientId}/summary` | Default page shown when a client is selected. `docs/UI.md` only says "displays basic client information" — exact fields/layout from the `ClientSummary` schema (employees, supervisors, activities, fundingSources, holidays, settings) is a FE call to make at build time. |

---

## Phase 2 — Pay Periods Index

| # | Ticket | Status | Depends on | Backend endpoint(s) | Notes |
|---|---|---|---|---|---|
| 6 | Pay Periods Index page | Backlog | #3, #4 | `GET /api/v1/payPeriod/{clientId}` | Reverse-chronological list, each row shows Pay Period Name + Status. Row click navigates to the Dashboard route (route can point at a stub until #8 exists). |
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
| 10 | Card 2 — Employee Timesheet Status | Backlog | #8 | `GET /api/v1/timesheet/status/{clientId}/{payPeriodId}`, `GET`/`PUT /api/v1/payrollReport/{clientId}/{payPeriodId}/employee-expenses`, `POST /api/v1/timesheet/{clientId}/{payPeriodId}/generate`, `POST /api/v1/payrollReport/{clientId}/{payPeriodId}/allocation-report` | Largest card — per-employee row (name, 5-state status, Include/Ignore toggle, Total Expense field), plus "Generate Timesheets" (always enabled) and "Write Allocation Report" (enabled once all included employees have Total Expense entered) buttons. Flagged as a likely candidate to split into sub-tickets once we're actually in it — decide at build time, not now. |
| 11 | Card 3 — Payroll Report | Backlog | #8 | `GET`/`POST /api/v1/payrollReport/{clientId}/{payPeriodId}`, generate: `POST /api/v1/payrollReport/{clientId}/{payPeriodId}/generate` | "Generate Payroll Report" button (re-runnable). In-app report display is explicitly design-TBD in `docs/UI.md` (modal vs. separate page) — decide at build time. Also note: there's no explicit "payroll report status" field in the API response — FE will need to infer generated/not-generated state from data presence, decide the exact approach in this ticket. |
| 12 | Card 4 — Allocation Report | Backlog | #8 | `GET`/`POST /api/v1/payrollReport/{clientId}/{payPeriodId}/allocation-report`, `GET`/`PUT /api/v1/payrollReport/{clientId}/{payPeriodId}/additional-expenses`, `PATCH /api/v1/payPeriod/{clientId}/{payPeriodId}/close` | Funding-source allocation display, org-level additional-expense fields (distributed proportionally by the backend), and "Close Pay Period" button (enabled once the allocation report has been generated). |

---

## Decisions already made (so we don't re-litigate them)

- **State management**: no new library. Plain React state/hooks (`useState`/`useContext`) — the app is button-triggered throughout, not live/reactive, so there's no need for TanStack Query/Redux/etc.
- **Logging**: skipped. This is a small internal tool for a small company, not a public-facing product — no automated error-tracking/observability layer planned.
- **Auth**: mocked/stubbed only (see "Known open item" above) until backend auth work begins.
