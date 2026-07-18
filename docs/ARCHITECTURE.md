# BlackwellTime Frontend Architecture

Living map of the frontend's shape and major decisions. This is intentionally higher-level than `docs/STYLE_GUIDE.md`: architecture explains how the app is put together and where responsibilities live; the style guide explains file layout, imports, typing, formatting, and other code mechanics.

Keep this document short. When a decision becomes a broad rule for future work, record it here and put the implementation details in `STYLE_GUIDE.md`.

---

## 1. App Shape

The frontend is a client-scoped internal operations app. Most workflows start at Client Summary, then navigate into pages for one selected client or one selected client resource.

- The persistent app shell lives in `AppLayout`.
- The full route tree lives in `src/router.tsx`.
- Client Summary cards are the primary navigation surface. There is no client-management drawer.
- Route path segments follow the app's existing camelCase resource naming, e.g. `payPeriod`, `payrollReport`, `allocationReport`, and `timesheetFolders`.

## 2. Navigation State

The URL is the source of truth for selected resources.

- The selected client is `:clientId` in the route, not reducer state.
- Pages derive the selected `Client` by resolving `:clientId` against the client list in context.
- Pages redirect only after the client list is loaded and the route id still does not resolve.
- Refresh, bookmarks, and browser back/forward should preserve the current selected resource.

This keeps navigation inspectable and avoids hidden state transitions when moving between clients or client resources.

## 3. Data Ownership

Data is fetched at the narrowest page/use-case boundary that needs it.

- Cross-page context is for genuinely shared app state, such as the fetched client list.
- Page-specific data lives in the page, not in a global summary object.
- It is acceptable for sibling pages to fetch independently, even if there is some overlap.
- Shared hooks may own mechanics such as keyed fetch lifecycle and refetching, but pages still own their loading/error/empty display decisions.

The point is to keep pages purpose-fit and avoid coupling future screens to one oversized response shape.

## 4. API Boundary

The generated OpenAPI client is the frontend/backend contract.

- Generated files under `src/api/generated` are never hand-edited.
- `src/api/client.ts` owns the configured API instances, one instance per OpenAPI tag.
- Frontend code calls those configured instances rather than constructing API classes ad hoc.
- Backend validation messages are surfaced where useful through the shared error-message utility.

## 5. Responsibility Split

The backend owns business logic. The frontend owns interaction.

Frontend code should collect input, render state, call endpoints, and show results. It should not reimplement backend rules such as payroll calculations, allocation math, status derivation, Drive validation, or uniqueness checks.

Display-only formatting is fine in the frontend. Business decisions belong on the backend.

## 6. Page Composition

The app favors small page-owned workflows composed from shared primitives once a pattern proves itself.

Current shared management-page primitives:

- `ClientManagementPage`: client-scoped management page shell.
- `NavButton`: shared route-navigation button.
- `ManagementListPanel`: list page panel with controls/loading/error/empty/content states.
- `ManagementToolbar`: left-side controls plus right-side primary action.
- `ManagementTable`: reusable MUI table shell.
- `ManagementDialog`: reusable dialog chrome/actions/error/loading shell.
- `DeleteConfirmationDialog`: reusable hard-delete confirmation chrome/actions/error/loading shell.

Feature components should still own domain-specific rows, forms, request payloads, and validation copy. Extract shared components when the repetition is real and the boundary is clear.

## 7. Client Management Boundary

Client management epics are separate by resource.

Timesheet Folder Management owns the client's available timesheet folder locations: list, active/inactive visibility, Drive open action, create, and edit name/status. Drive folder ID/link is immutable after creation.

Employee Management owns employee identity/contact fields, pay rates, active/inactive status, and the employee's stored `timesheetFileId`. During employee creation, the UI can either send a pasted existing timesheet link for backend validation/extraction or send an Active Timesheet Folder id as a provisioning destination for a new workbook. The folder is a creation-time destination only; the frontend does not model a durable employee-to-folder assignment. Pay Period workflows later consume the employee `timesheetFileId`.

Holiday Management owns the client's shared holiday dates: list, create, edit, and hard delete. The Client Summary Holidays card links to `/client/:clientId/holidays`; the management page lists holidays sorted by date by default, supports name/date table sorting, and uses UTC-safe medium date display. Create/edit require a holiday name and date; delete uses the shared confirmation dialog and warns that future generated timesheets and payroll calculations will no longer use the deleted holiday. Pay Period behavior consumes holiday configuration later but is not part of the Holiday Management UI.

Funding Source Management owns the client's funding source names and optional external accounting codes: list, create, edit, and hard delete. The Client Summary Funding Sources card links to `/client/:clientId/fundingSources`; the management page lists funding sources sorted by name by default and supports name/code table sorting. Create/edit require a funding source name and keep funding source code optional plain text. Delete uses the shared confirmation dialog and warns that activity allocation setup and reporting may be affected. Activity Management consumes funding sources later; allocation behavior is not part of this UI.

Activity Management owns the client's activity configuration: list, create, edit, and hard delete. The Client Summary Activities card links to `/client/:clientId/activities`; the management page lists activities sorted by activity name by default and supports activity/category/pay-rate table sorting. Activities depend on Funding Source Management because create/edit allocation rows choose from configured funding sources. The frontend gates allocation saves until the visible editable percentages total exactly 100, while the backend remains the authority for validation and final normalization. Delete uses the shared confirmation dialog and warns that generated timesheets, payroll, and allocation reporting may be affected. Pay Period and reporting workflows consume activity configuration later but are not part of the Activity Management UI.

## 8. Related Docs

- `docs/STYLE_GUIDE.md`: concrete code conventions and mechanics.
- `docs/TICKETS.md`: ticket board and epic status.
- `docs/PAY_PERIOD_PAGES.md`: detailed design record for the pay-period page split.
