const EmployeeStatusValue = {
  Active: 'Active',
  Inactive: 'Inactive',
} as const;

type EmployeeStatusValue = typeof EmployeeStatusValue[keyof typeof EmployeeStatusValue];

export default EmployeeStatusValue;
export type { EmployeeStatusValue };
