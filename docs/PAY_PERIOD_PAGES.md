# Pay Period Pages — Design

Redesign settled 2026-07-11, replacing the original single-page "Pay Period Dashboard" (with a two-column sticky footer for Payroll/Allocation Report actions) with four pages: one shared layout plus three sibling views. This doc is the reference for that design — `TICKETS.md` tracks what's built vs. left; `STYLE_GUIDE.md` §5/§8 hold the two generalizable rules this design established. See `docs/openapi.json` / the backend repo for exact request/response shapes.

**Why the redesign happened**: the original plan grew one card at a time and ended up conflating three genuinely different things onto one page/table — live timesheet data (owned by the employee/supervisor, immutable to this app), payroll-processing state (owned by this app, mutable), and the generated Payroll/Allocation Report artifacts themselves. Splitting them into pages that each own one concern turned out to be more legible than one page trying to be all three at once.

---

## 1. `PayPeriodLayout`

A layout route, not a page with its own content — same relationship `AppLayout` has to `Header`/`Outlet`, one level deeper.

- **Route**: `/client/:clientId/payPeriod/:payPeriodId`, parent to three children (`TimesheetStatusPage` as `index`, `PayrollReportPage` at `payrollReport`, `AllocationReportPage` at `allocationReport`).
- **Renders**: `PayPeriodInfoCard` (already built — status chip + name, one line) + a **`Tabs`** switcher between the three children (not `Breadcrumbs` — these are sibling views, not a hierarchical trail) + `<Outlet/>`.
- **Fetches**: only the base `PayPeriod` object (`payPeriodApi.v1GetPayPeriodById`) — the one thing needed for its own `PayPeriodInfoCard`. Owns the `clientId` validation/redirect guard (`useSelectedClient`, same pattern as `ClientSummary.tsx`) once, for all three children.
- **Passes down**: a `refetchPayPeriod` callback via `<Outlet context={...}>` / `useOutletContext()` — needed because `TimesheetStatusPage`'s Generate Payroll Report action flips `PayPeriod.status` server-side, and the parent owns that fetch. This is a callback, not shared fetched data — doesn't contradict independent-fetches (see `STYLE_GUIDE.md` §3/§5 addition).

Supersedes the old `PayPeriodDashboard.tsx`, which is being split into this layout + `TimesheetStatusPage`.

---

## 2. `TimesheetStatusPage`

The index child — renders at the parent's own path, no extra segment.

- **Fetches** (three independent fetches, own purpose each):
  1. `EmployeeTimesheetStatus[]` (`timesheetApi.v1GetTimesheetStatus`) — live timesheet data. **Needs a backend fix**: add `flatRateQuantity` (see Backend Work below).
  2. `EmployeeExpense[]` (`payrollReportApi.v1GetEmployeeExpenses`) — for the toggle's actual value (`activeThisPayPeriod`).
  3. `PayrollReportResponse | null` (`payrollReportApi.v1GetPayrollReport`) — for the "matches pay period report" comparison. **Needs a backend fix**: add per-employee `totalHours`/`totalFlatRate` aggregates (see Backend Work below).
- **Table columns** (join #1 and #2 by `employeeId`): Name, timesheet link (`timesheetFileLink`), Total Hours (live), Status (chip), Include/Ignore toggle, "matches pay period report" indicator.
  - **Toggle**: saves immediately on click (`Switch`, not batched), optimistically flips, reverts on failure. Preemptively disabled when `totalHours > 0 || flatRateQuantity > 0` (both live, from fetch #1) — not perfectly authoritative after a report's been generated (live data can drift from the report's locked-in snapshot), but that's fine: the backend's real validation is still the final authority, and failure already reverts + shows `ErrorTooltip`.
  - **"Matches pay period report" indicator**: only rendered once fetch #3 is non-null (nothing to compare before a report exists). Compares live `totalHours`(+ `flatRateQuantity`) against the report's snapshot aggregates; if they disagree, shows an icon + tooltip (same shape as `ErrorTooltip`, probably "warning" severity, not "error" — a mismatch isn't necessarily wrong, just worth knowing about; the exact icon/component is a build-time detail, could be a generalized `Shared/IconTooltip` accepting a severity, or its own small component).
- **Generate Payroll Report button** lives here (not a footer) — the data driving that decision (completion status) lives on this page. Reuses the exact `useAsyncAction` logic already built for the old footer's version, including refetching the parent's `PayPeriod` (via the `Outlet` context callback) since status flips to `Processed` on success.
- Deferred, not core to a first pass (same as before): grouping by status, pagination, column sorting.

---

## 3. `PayrollReportPage`

- **Route**: `payrollReport` child.
- **Fetches** (independent):
  1. `getPayrollReport` — the report's actual content: per-employee `hourly[]`/`flatRate[]` breakdown + the new aggregate fields.
  2. `getEmployeeExpenses` — `activeThisPayPeriod` (disables excluded employees' rows) and current `totalExpense` values.
  3. `getAllocationReport` — used only to check presence (empty array = none generated yet), to decide whether to show the Generate Allocation Report button or treat saves as auto-regenerating (see below). Already exists as a `GET`, confirmed 2026-07-11 — no new backend endpoint needed for this check.
- **Table**: one row per employee (joined by `employeeId`) — name, total hours (from the report), a Total Expense field, disabled entirely if `activeThisPayPeriod` is false.
- **Total Expense save mechanics — deliberately different from the toggle**: typed input, not auto-saved per field or per row. One page-level **"Save All"** button sends the complete current set of `EmployeeExpense` rows (not a diff — matches both the batch-entry workflow and the Google-Sheets-as-DB reality that individual-field updates are brittle/not really supported; a full-payload rewrite is the natural fit either way). **Needs a new backend batch endpoint** (see Backend Work below). A `useBlocker` navigation guard protects the whole unsaved batch before "Save All" is clicked — separate concern from "already-saved values aren't locked and can be corrected later," which doesn't need protecting.
- **Generate Allocation Report button**:
  - Enabled once all active/included employees have `totalExpense` populated (same gate originally worked out, just relocated here).
  - **First-ever generation is manual** (this button) — avoids pointless attempts that would fail before there's anything to generate.
  - **After the first success, no more button anywhere** — any subsequent save (this page's "Save All", or Additional Expenses on the Allocation Report page) automatically triggers regeneration in the background. Failures on these automatic attempts are handled silently (logged, not surfaced) — by this point prerequisites are already established, so this is a rare-edge-case safety net, not an expected-failure path like it would have been pre-first-generation.
  - No parent-refetch needed for this action — confirmed 2026-07-11 that `generateAllocationReport` does not touch `PayPeriod.status` (unlike Payroll Report generation).
- Deferred, optional: expanding a row to show the underlying per-category detail (the `hourly[]`/`flatRate[]` breakdown) inline.

---

## 4. `AllocationReportPage`

- **Route**: `allocationReport` child.
- **Table is per-funding-source, not per-employee** — `AllocationReportRow`: `{ fundingSourceName, wagesAllocation, additionalExpenses, total }`.
- **Fetches**: `getAllocationReport` (display only — no Generate button on this page at all, per the pipeline model: each stage's trigger lives on the stage _before_ it).
- **Additional Expenses**: org-level `{ expenseName, amount }` entries, proportionally distributed across funding sources by the backend's own calculation (`buildAllocationRows.ts`). Same interaction shape as Total Expense: typed input, explicit save (not per-field auto-save), `useBlocker` guard. Saving successfully triggers automatic allocation-report regeneration (same background mechanism as `PayrollReportPage`'s saves, once the first generation has happened) — allocation reports aren't archived/versioned (unlike Payroll Reports); the latest is always assumed correct, since this is a working bookkeeping tool, not a record of history.
- **Close Pay Period button** — `PATCH .../close`, the final action in the pipeline, enabled once an allocation report exists.

---

## Backend work needed (tracked here, prompt handed off separately)

1. Fix `updateEmployeeExpenses.ts`'s `UnprocessableError` message to use `employeeName`, not `employeeId` (found 2026-07-11, unrelated to this redesign but still outstanding).
2. Add `flatRateQuantity` to `EmployeeTimesheetStatus` (`getTimesheetStatuses.ts`) — live data, already totaled on the timesheet, just missing from this response.
3. Add per-employee `totalHours`/`totalFlatRate` aggregate fields to `getPayrollReport`'s response (`EmployeePayrollSummary`/`buildPayrollReportResponse.ts`) — computed from the already-present `hourly[]`/`flatRate[]` breakdown, so the frontend never has to reconstruct these itself (avoids a real subtlety around flat-rate "quantity" not meaning the same thing as hourly "hours").
4. New batch endpoint accepting `EmployeeExpense[]` (full-array replace, not a diff) for `PayrollReportPage`'s "Save All" — additive to the existing one-off single-employee `PUT`, which the toggle still uses as-is.
