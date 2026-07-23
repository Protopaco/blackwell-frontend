import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { employeeApi } from '@/api/client';
import type { Employee } from '@/api/generated/models/Employee';
import EmployeeStatusValue from '@/models/EmployeeStatusValue';
import type { EmployeeStatusValue as EmployeeStatusValueType } from '@/models/EmployeeStatusValue';
import { useToast } from '@/state/toast/toast.context';
import currencyToString from '@/utils/currencyToString';
import resolveErrorMessage from '@/utils/resolveErrorMessage';

type Input = {
  clientId: string;
  employee: Employee | null;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
};

const useEditEmployeeForm = ({ clientId, employee, open, onClose, onSaved }: Input) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [position, setPosition] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<EmployeeStatusValueType>(EmployeeStatusValue.Active);
  const [hourlyPayRate1, setHourlyPayRate1] = useState('');
  const [hourlyPayRate2, setHourlyPayRate2] = useState('');
  const [holidayPayRate, setHolidayPayRate] = useState('');
  const [timesheetFileId, setTimesheetFileId] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (!open || !employee) return;

    setFirstName(employee.firstName ?? '');
    setLastName(employee.lastName ?? '');
    setPosition(employee.position ?? '');
    setEmail(employee.email ?? '');
    setStatus(employee.status ?? EmployeeStatusValue.Active);
    setHourlyPayRate1(currencyToString(employee.hourlyPayRate1));
    setHourlyPayRate2(currencyToString(employee.hourlyPayRate2));
    setHolidayPayRate(currencyToString(employee.holidayPayRate));
    setTimesheetFileId(employee.timesheetFileId ?? '');
    setSubmitted(false);
    setErrorMessage(null);
  }, [employee, open]);

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setPosition('');
    setEmail('');
    setStatus(EmployeeStatusValue.Active);
    setHourlyPayRate1('');
    setHourlyPayRate2('');
    setHolidayPayRate('');
    setTimesheetFileId('');
    setSubmitted(false);
    setErrorMessage(null);
  };

  const closeDialog = () => {
    if (saving) return;
    resetForm();
    onClose();
  };

  const saveEmployee = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving || !employee?.employeeId) return;

    setSubmitted(true);
    setErrorMessage(null);

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedPosition = position.trim();
    const trimmedEmail = email.trim();
    const parsedHourlyPayRate1 = Number(hourlyPayRate1);
    const parsedHourlyPayRate2 = Number(hourlyPayRate2);
    const parsedHolidayPayRate = Number(holidayPayRate);

    if (
      !trimmedFirstName ||
      !trimmedLastName ||
      !trimmedPosition ||
      !trimmedEmail ||
      !hourlyPayRate1 ||
      !hourlyPayRate2 ||
      !holidayPayRate ||
      Number.isNaN(parsedHourlyPayRate1) ||
      Number.isNaN(parsedHourlyPayRate2) ||
      Number.isNaN(parsedHolidayPayRate)
    ) {
      return;
    }

    setSaving(true);

    try {
      await employeeApi.v1UpdateEmployee({
        clientId,
        employeeId: employee.employeeId,
        employee: {
          employeeId: employee.employeeId,
          firstName: trimmedFirstName,
          lastName: trimmedLastName,
          position: trimmedPosition,
          email: trimmedEmail,
          status,
          hourlyPayRate1: parsedHourlyPayRate1,
          hourlyPayRate2: parsedHourlyPayRate2,
          holidayPayRate: parsedHolidayPayRate,
          timesheetFileId,
        },
      });
      resetForm();
      onClose();
      onSaved();
      showToast('Employee updated.', 'success');
    } catch (error) {
      console.error('Failed to update employee.', error);
      const message = await resolveErrorMessage(error, 'Failed to update employee.');
      setErrorMessage(message);
      showToast(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return {
    closeDialog,
    email,
    emailRequired: submitted && !email.trim(),
    errorMessage,
    firstName,
    firstNameRequired: submitted && !firstName.trim(),
    holidayPayRate,
    holidayPayRateInvalid: submitted && (!holidayPayRate || Number.isNaN(Number(holidayPayRate))),
    hourlyPayRate1,
    hourlyPayRate1Invalid: submitted && (!hourlyPayRate1 || Number.isNaN(Number(hourlyPayRate1))),
    hourlyPayRate2,
    hourlyPayRate2Invalid: submitted && (!hourlyPayRate2 || Number.isNaN(Number(hourlyPayRate2))),
    lastName,
    lastNameRequired: submitted && !lastName.trim(),
    position,
    positionRequired: submitted && !position.trim(),
    saveEmployee,
    saving,
    setEmail,
    setFirstName,
    setHolidayPayRate,
    setHourlyPayRate1,
    setHourlyPayRate2,
    setLastName,
    setPosition,
    setStatus,
    status,
    timesheetFileId,
  };
};

export default useEditEmployeeForm;
