import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { employeeApi, timesheetFolderApi } from '@/api/client';
import { EmployeeCreateRequestStatusEnum } from '@/api/generated/models/EmployeeCreateRequest';
import { TimesheetFolderStatusEnum } from '@/api/generated/models/TimesheetFolder';
import type { TimesheetFolder } from '@/api/generated/models/TimesheetFolder';
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
  const [status, setStatus] = useState<EmployeeCreateRequestStatusEnum>(EmployeeCreateRequestStatusEnum.Active);
  const [hourlyPayRate1, setHourlyPayRate1] = useState('');
  const [hourlyPayRate2, setHourlyPayRate2] = useState('');
  const [holidayPayRate, setHolidayPayRate] = useState('');
  const [timesheetSetupMode, setTimesheetSetupMode] = useState<TimesheetSetupMode>('newWorkbook');
  const [timesheetFolderId, setTimesheetFolderId] = useState('');
  const [timesheetFileId, setTimesheetFileId] = useState('');
  const [timesheetFolders, setTimesheetFolders] = useState<TimesheetFolder[]>([]);
  const [loadingTimesheetFolders, setLoadingTimesheetFolders] = useState(false);
  const [timesheetFolderErrorMessage, setTimesheetFolderErrorMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    setStatus(EmployeeCreateRequestStatusEnum.Active);
    setHourlyPayRate1('');
    setHourlyPayRate2('');
    setHolidayPayRate('');
    setTimesheetSetupMode('newWorkbook');
    setTimesheetFolderId('');
    setTimesheetFileId('');
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
    const trimmedTimesheetFileId = timesheetFileId.trim();
    const parsedHourlyPayRate1 = Number(hourlyPayRate1);
    const parsedHourlyPayRate2 = Number(hourlyPayRate2);
    const parsedHolidayPayRate = Number(holidayPayRate);
    const usingNewWorkbook = timesheetSetupMode === 'newWorkbook';

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
      Number.isNaN(parsedHolidayPayRate) ||
      (usingNewWorkbook && !timesheetFolderId) ||
      (!usingNewWorkbook && !trimmedTimesheetFileId)
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
          hourlyPayRate1: parsedHourlyPayRate1,
          hourlyPayRate2: parsedHourlyPayRate2,
          holidayPayRate: parsedHolidayPayRate,
          timesheetFolderId: usingNewWorkbook ? timesheetFolderId : undefined,
          timesheetFileId: usingNewWorkbook ? undefined : trimmedTimesheetFileId,
        },
      });
      resetForm();
      onClose();
      onCreated();
    } catch (error) {
      console.error('Failed to create employee.', error);
      setErrorMessage(await resolveErrorMessage(error, 'Failed to create employee.'));
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
    holidayPayRate,
    holidayPayRateInvalid: submitted && (!holidayPayRate || Number.isNaN(Number(holidayPayRate))),
    hourlyPayRate1,
    hourlyPayRate1Invalid: submitted && (!hourlyPayRate1 || Number.isNaN(Number(hourlyPayRate1))),
    hourlyPayRate2,
    hourlyPayRate2Invalid: submitted && (!hourlyPayRate2 || Number.isNaN(Number(hourlyPayRate2))),
    lastName,
    lastNameRequired: submitted && !lastName.trim(),
    loadingTimesheetFolders,
    noActiveTimesheetFolders,
    position,
    positionRequired: submitted && !position.trim(),
    saving,
    setEmail,
    setFirstName,
    setHolidayPayRate,
    setHourlyPayRate1,
    setHourlyPayRate2,
    setLastName,
    setPosition,
    setStatus,
    setTimesheetFileId,
    setTimesheetFolderId,
    setTimesheetSetupMode,
    status,
    timesheetFileId,
    timesheetFileRequired: submitted && timesheetSetupMode === 'existingWorkbook' && !timesheetFileId.trim(),
    timesheetFolderErrorMessage,
    timesheetFolderId,
    timesheetFolderRequired: submitted && timesheetSetupMode === 'newWorkbook' && !timesheetFolderId,
    timesheetFolders,
    timesheetSetupMode,
  };
};

export default useCreateEmployeeForm;
