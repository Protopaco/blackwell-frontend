import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { activityApi, employeeApi } from '@/api/client';
import { EmployeeActivityRatePayRateTypeEnum } from '@/api/generated/models/EmployeeActivityRate';
import type { Employee } from '@/api/generated/models/Employee';
import type { EmployeeActivityRateFormRow } from '../../CreateEmployeeDialog/EmployeeActivityRatesFields/EmployeeActivityRateFormRow';
import EmployeeStatusValue from '@/models/EmployeeStatusValue';
import type { EmployeeStatusValue as EmployeeStatusValueType } from '@/models/EmployeeStatusValue';
import { useToast } from '@/state/toast/toast.context';
import useFetchByKey from '@/hooks/useFetchByKey';
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
  const [activityRates, setActivityRates] = useState<EmployeeActivityRateFormRow[]>([]);
  const [timesheetFileId, setTimesheetFileId] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { showToast } = useToast();

  const { data: activities } = useFetchByKey(
    open ? clientId : undefined,
    (clientId) => activityApi.v1GetActivities({ clientId }),
    'Failed to load activities.',
  );

  const addActivityRate = () => {
    setActivityRates((currentActivityRates) => {
      const currentActivityIds = currentActivityRates.map((activityRate) => activityRate.activityId).filter(Boolean);
      const availableActivity = (activities ?? []).find((activity) => !currentActivityIds.includes(activity.activityId ?? ''));

      return [
        ...currentActivityRates,
        {
          activityId: availableActivity?.activityId ?? '',
          payRateType: EmployeeActivityRatePayRateTypeEnum.Hourly,
          payRate: '',
          holidayPayRate: '',
        },
      ];
    });
  };

  const updateActivityRate = (index: number, nextActivityRate: EmployeeActivityRateFormRow) => {
    setActivityRates((currentActivityRates) =>
      currentActivityRates.map((activityRate, activityRateIndex) => (activityRateIndex === index ? nextActivityRate : activityRate)),
    );
  };

  const removeActivityRate = (index: number) => {
    setActivityRates((currentActivityRates) => currentActivityRates.filter((_, activityRateIndex) => activityRateIndex !== index));
  };

  useEffect(() => {
    if (!open || !employee) return;

    setFirstName(employee.firstName ?? '');
    setLastName(employee.lastName ?? '');
    setPosition(employee.position ?? '');
    setEmail(employee.email ?? '');
    setStatus(employee.status ?? EmployeeStatusValue.Active);
    setSalaried((employee.salaryAmount ?? 0) > 0);
    setSalaryAmount(employee.salaryAmount ? currencyToString(employee.salaryAmount) : '');
    setActivityRates(
      (employee.activityRates ?? []).map((activityRate) => ({
        id: activityRate.id,
        activityId: activityRate.activityId,
        payRateType: activityRate.payRateType,
        payRate: currencyToString(activityRate.payRate),
        holidayPayRate: currencyToString(activityRate.holidayPayRate),
      })),
    );
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
    setActivityRates([]);
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
    const selectedActivityIds = activityRates.map((activityRate) => activityRate.activityId).filter(Boolean);
    const hasMissingActivity = activityRates.some((activityRate) => !activityRate.activityId);
    const hasDuplicateActivity = new Set(selectedActivityIds).size !== selectedActivityIds.length;
    const hasInvalidPayRate = activityRates.some((activityRate) => {
      if (activityRate.payRateType === EmployeeActivityRatePayRateTypeEnum.Salary) return false;
      return activityRate.payRate === '' || Number.isNaN(Number(activityRate.payRate));
    });
    const hasInvalidHolidayPayRate = activityRates.some((activityRate) => {
      if (activityRate.payRateType === EmployeeActivityRatePayRateTypeEnum.Salary) return false;
      return activityRate.holidayPayRate === '' || Number.isNaN(Number(activityRate.holidayPayRate));
    });

    if (
      !trimmedFirstName ||
      !trimmedLastName ||
      !trimmedPosition ||
      !trimmedEmail ||
      (salaried && (!salaryAmount || Number.isNaN(parsedSalaryAmount))) ||
      hasMissingActivity ||
      hasDuplicateActivity ||
      hasInvalidPayRate ||
      hasInvalidHolidayPayRate
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
          activityRates: activityRates.map((activityRate) => ({
            id: activityRate.id,
            activityId: activityRate.activityId,
            payRateType: activityRate.payRateType,
            payRate: activityRate.payRateType === EmployeeActivityRatePayRateTypeEnum.Salary ? 0 : Number(activityRate.payRate),
            holidayPayRate: activityRate.payRateType === EmployeeActivityRatePayRateTypeEnum.Salary ? 0 : Number(activityRate.holidayPayRate),
          })),
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

  const selectedActivityIds = activityRates.map((activityRate) => activityRate.activityId).filter(Boolean);

  return {
    activities: activities ?? [],
    activityRates,
    addActivityRate,
    closeDialog,
    duplicateActivity: submitted && new Set(selectedActivityIds).size !== selectedActivityIds.length,
    email,
    emailRequired: submitted && !email.trim(),
    errorMessage,
    firstName,
    firstNameRequired: submitted && !firstName.trim(),
    lastName,
    lastNameRequired: submitted && !lastName.trim(),
    position,
    positionRequired: submitted && !position.trim(),
    removeActivityRate,
    salaried,
    salaryAmount,
    salaryAmountInvalid: submitted && salaried && (!salaryAmount || Number.isNaN(Number(salaryAmount))),
    saveEmployee,
    saving,
    selectedActivityIds,
    setEmail,
    setFirstName,
    setLastName,
    setPosition,
    setSalaried,
    setSalaryAmount,
    setStatus,
    status,
    submitted,
    timesheetFileId,
    updateActivityRate,
  };
};

export default useEditEmployeeForm;
