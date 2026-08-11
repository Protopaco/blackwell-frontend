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
  const [salaried, setSalaried] = useState(false);
  const [salaryAmount, setSalaryAmount] = useState('');
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
    setSalaried((employee.salaryAmount ?? 0) > 0);
    setSalaryAmount(employee.salaryAmount ? currencyToString(employee.salaryAmount) : '');
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
    setSalaried(false);
    setSalaryAmount('');
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
    const parsedSalaryAmount = Number(salaryAmount);

    if (
      !trimmedFirstName ||
      !trimmedLastName ||
      !trimmedPosition ||
      !trimmedEmail ||
      (salaried && (!salaryAmount || Number.isNaN(parsedSalaryAmount)))
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
          salaryAmount: salaried ? parsedSalaryAmount : 0,
          activityRates: employee.activityRates ?? [],
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
    lastName,
    lastNameRequired: submitted && !lastName.trim(),
    position,
    positionRequired: submitted && !position.trim(),
    salaried,
    salaryAmount,
    salaryAmountInvalid: submitted && salaried && (!salaryAmount || Number.isNaN(Number(salaryAmount))),
    saveEmployee,
    saving,
    setEmail,
    setFirstName,
    setLastName,
    setPosition,
    setSalaried,
    setSalaryAmount,
    setStatus,
    status,
    timesheetFileId,
  };
};

export default useEditEmployeeForm;
