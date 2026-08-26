# BACKLOG

---

- [002] - Update "matches pay period report" indicator so all timesheets are read the same way
- [003] - Unsaved changes guard - Payroll Report
- [004] - Unsaved changes guard - Allocation Report
- [006] - Employee email format validation and normalization
- [007] - Supervisor Management Epic
- [009] - Employee Timesheet Status - collapsible groups by status
- [010] - Client Accent Color
- [014] - Create Frontend Tests
- [016] - Generic Schema Dricen Backend Validation
- [017] - Restyle Pay Period Tabs
- [018] - Adjust Colors of Timesheet status chips
- [021] - Deep-link "Open timesheet" to the current pay period's tab
- [022] - Toast coverage — remaining and future mutation flows
- [023] - Set Up Auth
- [036] - Auto-add required FundingSources when adding an Activity to a pay period (backend)
- [037] - Remove pay period status chip from pay period creation dialog
- [038] - Background color standardization to match ClientSummary.tsx's blue[50].
- [039] - Remove redundant PayPeriod Client Summary button
- [040] - Restyle Client Selector
- [042] - BUG - Direct/shared links to client pages 404 on Render
- [043] - BUG - Pay period dashboard shows holidays outside the pay period's date range
- [044] - BUG - Holiday styling looks off (coloration)
- [045] - Better "week of" styling on timesheet
- [046] - "Generate Payroll Report" should auto-navigate to Payroll Report tab like Allocation Report does
- [070] - Validation: require Settings fields on client create
- [071] - BUG - Client Name and Client Code must be unique
- [072] - Rename updateClient to reflect its actual (identity-only) scope
- [073] - Manage active/inactive clients (Clients list page)
- [075] - BUG - Redundant fetch calls during timesheet generation polling
- [076] - Tooltips on status chips explaining what each status means
- [083] - Remove `Activity.trackSeparately` — no discoverable purpose
- [085] - Frontend — grouped/reordered activities management UI
- [086] - Add a "Home" button that returns to the base screen
- [088] - BUG - Creating a new client should redirect to that client's Client Summary page
- [091] - BUG - PayPeriodRegistry tab year should come from the pay period, not the current date
- [092] - BUG - No way to edit an employee's activities on the Pay Period page (add edit icon on EmployeeTimesheetStatusRow, pre-generation only, dialog to add/remove EmployeeActivityRate on the pay-period snapshot, mirrors addActivityToPayPeriod.ts/removeActivityFromPayPeriod.ts + assertPayPeriodNotLocked)
- [097] - Remove `taxExpense` from the Payroll Report (frontend + backend) — now redundant, since the existing Additional Expenses editor on the Allocation Report already covers org-level taxes/benefits/etc. as flat named amounts split proportionally across funding sources. Drop the per-employee "Tax" input/column, remove taxExpense from the allExpensesComplete gate (generating the Allocation Report should only require wageExpense), and remove taxExpense end-to-end from EmployeeExpense (model, sheet read/write, API schema).
- [098] - Add an interactive npm-script menu for BlackwellTime Frontend, mirroring the one built for the backend: a `scripts/menu.ts` using `@clack/prompts` (devDependency) that lists every script from package.json (dev, build, preview, test, lint, format, format:check, api:gen) with a short hint, lets the user pick one, then spawns it with `stdio: 'inherit'`. Wired up via a `"menu"` script in package.json.

# READY

---

# IN PROGRESS

---

# DONE

---

- [095] - Remove "Taxes Allocation" from the Allocation Report (frontend + backend) — grants don't cover taxes this way; taxExpense entry on the Payroll Report page stays, only the Allocation Report's derived taxesAllocation column/calc goes. total becomes wages + additionalExpenses.
- [096] - Add optional "Fringe Rate" to Funding Source, applied as a flat rate on wages in the Allocation Report: Fringe = wagesAllocation × fringeRate (Option A — applied to the same wagesAllocation dollars already in the report, not a separate Hours×Rate calc). fringeAllocation is included in total. Rough draft to show client, exact grant fringe mechanics still TBD.
- [087] - BUG - Invalid/unmatched paths (e.g. /client/) 404 instead of redirecting home
- [089] - BUG - Dialogs should auto-focus their first field on open
- [090] - Auto-populate pay rate fields (pay rate type, pay rate, holiday pay rate) from the last entry when adding activities
- [093] - Add a "Date" line to the Employee Signature and Supervisor Signature rows on generated timesheets (display only, not read back into the app)
- [094] - Update app display title / package name — still "react-frontend-template" (index.html <title>, package.json "name")
- [084] - Backend — grouped/reordered activities on generated timesheets
- [082] - Split EmployeeExpenses "totalExpense" into "wageExpense" and "taxExpense"
- [047] - BUG - Employee timesheet generated after pay period closed doesn't show up in pay period summary
- [008] - Settings Management
- [074] - Timesheet formatting redesign — RowStyle layer + section labeling
- [059] - Client Management Workflow (Epic)
- [061] - Client Create page
- [062] - Edit Client dialog on ClientSummary
- [060] - "+ New Client" entry point
- [030] - Per-Pay-Period Configuration UI (Epic)
- [034] - Holidays — sync button in pay period header
- [067] - Cascade-delete EmployeeActivityRates rows when an Activity is deleted
- [068] - Remove old Activity payRate/flatRateAmount fields from frontend
- [069] - Remove old Employee hourlyPayRate/holidayPayRate fields from frontend
- [066] - Validation: Active employee must have at least one activityRate
- [048] - Expand EmployeeActivityRates (Epic)
- [049] - EmployeeActivityRates tab infra
- [051] - Update Employee — remove old pay rates, add salaryAmount + embed activityRates
- [052] - Update Activity — remove payRate/flatRateAmount
- [053] - devTestData scenario revamp
- [054] - EmployeeActivityRates in pay-period snapshot workflow + rate locking
- [055] - EmployeeActivityRates in timesheet generation + activity-required validation
- [056] - Update allocation calc to use EmployeeActivityRates + holidayPayRate
- [057] - Salary calculation
- [058] - Validation: salaried employee with zero salary-hours
- [063] - Employee Activity Rates in Employee Dialog (Epic)
- [064] - Employee dialog — remove old pay-rate fields, add Salaried toggle
- [065] - EmployeeActivityRatesFields — repeatable row list
- [033] - FundingSources tab
- [032] - Activities tab
- [035] Rename "timesheetStatus" page/route identifier to "Employees"
- [031] - Employees tab — rename + remove action
- [013] - Per pay period employee roster
- [024] — Capture config snapshot at period creation
- [025] — Redirect generation reads to snapshot
- [026] — Bulk pay-period-config read endpoint
- [027] — Edit pay period's employee roster
- [028] — Edit pay period's activities & funding sources
- [029] — Edit pay period's holidays snapshot
- [015] - Pay Period Info Refresh Button
- [001] - Global toast systems
- [000] - Employee Timesheet Status - refresh/reload button
- [019] - Restyle Client Sumamry Page
- [020] - BUG - Timesheet Status - Tim esheet links should be disabled when timesheets not generated
- [011] - Reformat Time Sheet Colors
- [012] - Caching System for timesheets (Sheets API Quota)
