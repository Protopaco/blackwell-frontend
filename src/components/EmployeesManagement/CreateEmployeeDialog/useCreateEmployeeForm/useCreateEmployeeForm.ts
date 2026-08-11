import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { employeeApi, timesheetFolderApi } from '@/api/client';
import { TimesheetFolderStatusEnum } from '@/api/generated/models/TimesheetFolder';
import type { TimesheetFolder } from '@/api/generated/models/TimesheetFolder';
import EmployeeStatusValue from '@/models/EmployeeStatusValue';
import type { EmployeeStatusValue as EmployeeStatusValueType } from '@/models/EmployeeStatusValue';
import { useToast } from '@/state/toast/toast.context';
import resolveErrorMessage from '@/utils/resolveErrorMessage';

type TimesheetSetupMode = 'newWorkbook' | 'existingWorkbook';

type Input = {
  clientId: string;
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

const useCreateEmployeeForm = ({ clientId, open, onClose, onCreated }: Input) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [position, setPosition] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<EmployeeStatusValueType>(EmployeeStatusValue.Active);
  const [salaried, setSalaried] = useState(false);
  const [salaryAmount, setSalaryAmount] = useState('');
  const [timesheetSetupMode, setTimesheetSetupMode] = useState<TimesheetSetupMode>('newWorkbook');
  const [timesheetFolderId, setTimesheetFolderId] = useState('');
  const [timesheetFileLink, setTimesheetFileLink] = useState('');
  const [timesheetFolders, setTimesheetFolders] = useState<TimesheetFolder[]>([]);
  const [loadingTimesheetFolders, setLoadingTimesheetFolders] = useState(false);
  const [timesheetFolderErrorMessage, setTimesheetFolderErrorMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    setLoadingTimesheetFolders(true);
    setTimesheetFolderErrorMessage(null);

    timesheetFolderApi
      .v1GetTimesheetFolders({ clientId })
      .then((folders) => {
        if (cancelled) return;

        const activeFolders = folders.filter((folder) => folder.status === TimesheetFolderStatusEnum.Active);
        setTimesheetFolders(activeFolders);
        setTimesheetFolderId(activeFolders[0]?.timesheetFolderId ?? '');
      })
      .catch(async (error) => {
        console.error('Failed to load timesheet folders.', error);
        if (cancelled) return;
        setTimesheetFolders([]);
        setTimesheetFolderId('');
        setTimesheetFolderErrorMessage(await resolveErrorMessage(error, 'Failed to load timesheet folders.'));
      })
      .finally(() => {
        if (cancelled) return;
        setLoadingTimesheetFolders(false);
      });

    return () => {
      cancelled = true;
    };
  }, [clientId, open]);

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setPosition('');
    setEmail('');
    setStatus(EmployeeStatusValue.Active);
    setSalaried(false);
    setSalaryAmount('');
    setTimesheetSetupMode('newWorkbook');
    setTimesheetFolderId('');
    setTimesheetFileLink('');
    setTimesheetFolders([]);
    setLoadingTimesheetFolders(false);
    setTimesheetFolderErrorMessage(null);
    setSubmitted(false);
    setErrorMessage(null);
  };

  const closeDialog = () => {
    if (saving) return;
    resetForm();
    onClose();
  };

  const createEmployee = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;

    setSubmitted(true);
    setErrorMessage(null);

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedPosition = position.trim();
    const trimmedEmail = email.trim();
    const trimmedTimesheetFileLink = timesheetFileLink.trim();
    const parsedSalaryAmount = Number(salaryAmount);
    const usingNewWorkbook = timesheetSetupMode === 'newWorkbook';

    if (
      !trimmedFirstName ||
      !trimmedLastName ||
      !trimmedPosition ||
      !trimmedEmail ||
      (salaried && (!salaryAmount || Number.isNaN(parsedSalaryAmount))) ||
      (usingNewWorkbook && !timesheetFolderId) ||
      (!usingNewWorkbook && !trimmedTimesheetFileLink)
    ) {
      return;
    }

    setSaving(true);

    try {
      await employeeApi.v1CreateEmployee({
        clientId,
        employeeCreateRequest: {
          firstName: trimmedFirstName,
          lastName: trimmedLastName,
          position: trimmedPosition,
          email: trimmedEmail,
          status,
          salaryAmount: salaried ? parsedSalaryAmount : 0,
          activityRates: [],
          timesheetFolderId: usingNewWorkbook ? timesheetFolderId : undefined,
          timesheetFileLink: usingNewWorkbook ? undefined : trimmedTimesheetFileLink,
        },
      });
      resetForm();
      onClose();
      onCreated();
      showToast('Employee created.', 'success');
    } catch (error) {
      console.error('Failed to create employee.', error);
      const message = await resolveErrorMessage(error, 'Failed to create employee.');
      setErrorMessage(message);
      showToast(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const noActiveTimesheetFolders =
    timesheetSetupMode === 'newWorkbook' && !loadingTimesheetFolders && !timesheetFolderErrorMessage && timesheetFolders.length === 0;

  return {
    closeDialog,
    createEmployee,
    email,
    emailRequired: submitted && !email.trim(),
    errorMessage,
    firstName,
    firstNameRequired: submitted && !firstName.trim(),
    lastName,
    lastNameRequired: submitted && !lastName.trim(),
    loadingTimesheetFolders,
    noActiveTimesheetFolders,
    position,
    positionRequired: submitted && !position.trim(),
    salaried,
    salaryAmount,
    salaryAmountInvalid: submitted && salaried && (!salaryAmount || Number.isNaN(Number(salaryAmount))),
    saving,
    setEmail,
    setFirstName,
    setLastName,
    setPosition,
    setSalaried,
    setSalaryAmount,
    setStatus,
    setTimesheetFileLink,
    setTimesheetFolderId,
    setTimesheetSetupMode,
    status,
    timesheetFileLink,
    timesheetFileLinkRequired: submitted && timesheetSetupMode === 'existingWorkbook' && !timesheetFileLink.trim(),
    timesheetFolderErrorMessage,
    timesheetFolderId,
    timesheetFolderRequired: submitted && timesheetSetupMode === 'newWorkbook' && !timesheetFolderId,
    timesheetFolders,
    timesheetSetupMode,
  };
};

export default useCreateEmployeeForm;
