import type { EmployeeTimesheetStatusStatusEnum } from '@/api/generated/models/EmployeeTimesheetStatus';

// The timesheet lifecycle, in order. Source of truth for "what comes after what" —
// sort rank, stage comparisons, and progress UI can all be derived from this array's ordering.
const TIMESHEET_STATUS_PROGRESSION: EmployeeTimesheetStatusStatusEnum[] = [
  'NotGenerated',
  'Generated',
  'Submitted',
  'Approved',
  'Complete',
];

export default TIMESHEET_STATUS_PROGRESSION;
