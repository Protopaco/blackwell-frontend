interface PayrollReportRow {
  employeeId: string;
  employeeName: string;
  totalHours: number;
  totalFlatRate: number;
  totalExpense: number | null;
}

export type { PayrollReportRow };
