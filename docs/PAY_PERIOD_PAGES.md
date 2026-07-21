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
  1. `EmployeeTimesheetStatus[]` (`timesheetApi.v1GetTimesheetStatus`) — live timesheet data, now includes `flatRateQuantity: number | null` (backend change landed 2026-07-12 — `null` specifically means the client has no flat-rate activities configured at all, not "zero logged this period"; that case is `0`).
  2. `EmployeeExpense[]` (`payrollReportApi.v1GetEmployeeExpenses`) — for the toggle's actual value (`activeThisPayPeriod`).
  3. `PayrollReportResponse | null` (`payrollReportApi.v1GetPayrollReport`) — for the "matches pay period report" comparison, now includes per-employee `totalHours`/`totalFlatRate` aggregates (backend change landed 2026-07-12, always numbers, never null).
- **Table columns** (join #1 and #2 by `employeeId`): Name, timesheet link (built client-side from `employee.timesheetFileId` — `https://docs.google.com/spreadsheets/d/{timesheetFileId}/edit`; the backend's `timesheetFileLink` field was removed 2026-07-13, see `TICKETS.md` #8.24), Total Hours (live), Status (chip), Include/Ignore toggle, "matches pay period report" indicator.
  - **Toggle**: saves immediately on click (`Switch`, not batched), optimistically flips, reverts on failure. Preemptively disabled when `totalHours > 0 || (flatRateQuantity ?? 0) > 0` (both live, from fetch #1 — note the null-coalesce, since `flatRateQuantity` can be `null`) — not perfectly authoritative after a report's been generated (live data can drift from the report's locked-in snapshot), but that's fine: the backend's real validation is still the final authority, and failure already reverts + shows `ErrorTooltip`.
  - **"Matches pay period report" indicator**: only rendered once fetch #3 is non-null (nothing to compare before a report exists). Compares live `totalHours`(+ `flatRateQuantity`) against the report's snapshot aggregates; if they disagree, shows an icon + tooltip (same shape as `ErrorTooltip`, probably "warning" severity, not "error" — a mismatch isn't necessarily wrong, just worth knowing about; the exact icon/component is a build-time detail, could be a generalized `Shared/IconTooltip` accepting a severity, or its own small component).
- **Generate Payroll Report button** lives here (not a footer) — the data driving that decision (completion status) lives on this page. Reuses the exact `useAsyncAction` logic already built for the old footer's version, including refetching the parent's `PayPeriod` (via the `Outlet` context callback) since status flips to `Processed` on success.
- Deferred, not core to a first pass (same as before): grouping by status, pagination, column sorting.

---

## 3. `PayrollReportPage`

- **Route**: `payrollReport` child.
- **Fetches** (independent):
  1. `getPayrollReport` — the report's actual content: per-employee `hourly[]`/`flatRate[]` breakdown + the new aggregate fields.
  2. `getEmployeeExpenses` — `activeThisPayPeriod` (disables excluded employees' rows) and current `totalExpense` values.
  3. **Diverged from the original plan**: allocation-report presence is *not* fetched here via `getAllocationReport`. It's derived from `payPeriod.status` (`allocationReportGenerated(status)` — true for `Allocated`/`Closed`) already available from `PayPeriodLayoutContext`, avoiding a speculative extra fetch/404-catch for something a real status field already answers. Same helper drives the Payroll Report tab and Allocation Report tab's `disabled` state in `PayPeriodLayout`'s `Tabs`.
- **Table**: one row per employee (joined by `employeeId`) — name, total hours (from the report), a Total Expense field, disabled entirely if `activeThisPayPeriod` is false.
- **Total Expense save mechanics — deliberately different from the toggle**: typed input, not auto-saved per field or per row. One page-level **"Save All"** button. **Backend shape landed 2026-07-12**: `PUT .../employeeExpenses/batch` takes `EmployeeExpenseUpdate[]` (`{ employeeId, totalExpense }[]`) — a **partial** update, not a full `EmployeeExpense[]` replace; it only ever touches `totalExpense`. **Gotcha resolved 2026-07-13**: the endpoint originally silently ignored any `employeeId` with no existing `EmployeeExpense` record (only created via the single-item `PUT`, i.e. an employee whose toggle was never explicitly saved) — their Total Expense would silently fail to persist. It's now a true upsert: creates the record (`employeeName` resolved server-side from PayrollConfig, `activeThisPayPeriod: true`) when one doesn't exist yet, and rejects the whole batch with a 422 naming the id if it doesn't match a real employee at all. No frontend-side detection or upstream guarantee needed — `11.2` can call the batch endpoint directly and trust it to handle every active employeeId correctly. **`useBlocker` guard deliberately not built** — out of scope through #12.4 (`TICKETS.md` #11.3), so an unsaved batch can currently be navigated away from without warning.
- **Generate Allocation Report button**:
  - Enabled once all active/included employees have `totalExpense` populated (same gate originally worked out, just relocated here).
  - **First-ever generation is manual** (this button) — avoids pointless attempts that would fail before there's anything to generate. On success, **auto-navigates to the Allocation Report tab** (`/client/:clientId/payPeriod/:payPeriodId/allocationReport`) — added during build so the user immediately sees the artifact they just created.
  - **After the first success, no more button anywhere** — any subsequent save (this page's "Save All", or Additional Expenses on the Allocation Report page) automatically triggers regeneration in the background, with no navigation. Failures on these automatic attempts are handled silently (logged via `console.error`, not surfaced, save/dirty-state never rolled back) — by this point prerequisites are already established, so this is a rare-edge-case safety net, not an expected-failure path like it would have been pre-first-generation.
  - No parent-refetch needed for the manual generation's own success, but the auto-navigate handler does call `refetchPayPeriod()` beforehand anyway (harmless, keeps the layout's status in sync in case a future backend change ties status to allocation state).
- Deferred, optional: expanding a row to show the underlying per-category detail (the `hourly[]`/`flatRate[]` breakdown) inline.

---

## 4. `AllocationReportPage`

- **Route**: `allocationReport` child.
- **Table is per-funding-source, not per-employee** — `AllocationReportRow`: `{ fundingSourceName, wagesAllocation, additionalExpenses, total }`.
- **Fetches**: `getAllocationReport` (display only — no Generate button on this page at all, per the pipeline model: each stage's trigger lives on the stage _before_ it).
- **Additional Expenses**: org-level `{ expenseName, amount }` entries, proportionally distributed across funding sources by the backend's own calculation (`buildAllocationRows.ts`). Same interaction shape as Total Expense: typed input via a row-based editor (`AdditionalExpensesEditor` + `AdditionalExpenseRow`, add/remove rows explicitly — no auto-added blank draft row), explicit "Save Additional Expenses" button (not per-field auto-save). Row validation: expense name required when an amount is present and vice versa, amount must be a valid non-negative number; completely empty rows are dropped before submit rather than rejected. `useBlocker` guard deliberately not built here either (`TICKETS.md` #12.3), same as `PayrollReportPage`. Saving successfully triggers automatic allocation-report regeneration only if a report already exists (same background mechanism as `PayrollReportPage`'s saves) — allocation reports aren't archived/versioned (unlike Payroll Reports); the latest is always assumed correct, since this is a working bookkeeping tool, not a record of history.
- **Close Pay Period button** — `PATCH .../close` (`payPeriodApi.v1ClosePayPeriod`), the final action in the pipeline. Lives on this page, near the allocation report controls (chosen over Payroll Report because the allocation report is the final downstream artifact). Enabled once an allocation report exists (via the same `allocationReportGenerated(payPeriod.status)` check used elsewhere); hidden entirely once the pay period is already `Closed`, matching the hide-when-done convention already established for the Generate Allocation Report button rather than a permanently-disabled control. Requires confirmation through the existing shared `DeleteConfirmationDialog` with neutral (non-delete) copy — "Close pay period?" / "Close Pay Period" — since the component's title/body/confirm-label are already prop-driven. On success, calls `refetchPayPeriod()` (via `PayPeriodLayoutContext`, extended with no shape changes needed) and stays on the Allocation Report tab; on failure, the error surfaces inside the confirmation dialog itself via `useAsyncAction`, and the dialog stays open rather than closing on a failed attempt.

---

## Backend work — done (landed 2026-07-12)

1. ✅ `updateEmployeeExpenses.ts`'s `UnprocessableError` message now uses `employeeName`, not `employeeId`.
2. ✅ `flatRateQuantity: number | null` added to `EmployeeTimesheetStatus` — `null` means the client has no flat-rate activities configured; otherwise a number (can be `0`).
3. ✅ `totalHours`/`totalFlatRate` added to the per-employee payroll summary (`getPayrollReport`'s response) — always numbers, default `0`, never null.
4. ✅ New endpoint `PUT .../employeeExpenses/batch`, taking `EmployeeExpenseUpdate[]` (`{ employeeId, totalExpense }[]`) — **partial** update, `totalExpense` only, silently ignores unknown `employeeId`s (see the gotcha called out in `PayrollReportPage`'s section above — still needs a design decision before `11.2`). Existing single-item `PUT` unchanged, still used by the toggle.
5. ✅ Bonus, not originally requested: the three kebab-case endpoint paths (`employee-expenses`, `additional-expenses`, `allocation-report`) were renamed to camelCase (`employeeExpenses`, `additionalExpenses`, `allocationReport`) — this was already flagged as follow-up migration debt (see the "Blackwell API Naming Convention" project note), so folding it into this same backend pass was a good opportunistic fix rather than a separate migration later.

API client regenerated 2026-07-12 (required a backend server restart before the new spec was actually served — same snag as the last regen).
