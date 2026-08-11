import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientApi } from '@/api/client';
import { SettingsPayPeriodIntervalEnum, SettingsTimeInputMethodEnum } from '@/api/generated/models/Settings';
import type { FolderChoiceMode } from '@/components/ClientManagement/FolderChoiceFields/FolderChoiceFields';
import { useToast } from '@/state/toast/toast.context';
import resolveErrorMessage from '@/utils/resolveErrorMessage';

const partialFailureFallbackMessage =
  'Failed to create client. Some Drive resources may already have been created — check before retrying.';

const useClientCreateForm = () => {
  const [clientName, setClientName] = useState('');
  const [clientCode, setClientCode] = useState('');
  const [employeePayrollFolderMode, setEmployeePayrollFolderMode] = useState<FolderChoiceMode>('createNew');
  const [employeePayrollFolderLink, setEmployeePayrollFolderLink] = useState('');
  const [rootFolderLink, setRootFolderLink] = useState('');
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [payrollConfigFolderMode, setPayrollConfigFolderMode] = useState<FolderChoiceMode>('createNew');
  const [payrollConfigFolderLink, setPayrollConfigFolderLink] = useState('');
  const [payrollReportFolderMode, setPayrollReportFolderMode] = useState<FolderChoiceMode>('createNew');
  const [payrollReportFolderLink, setPayrollReportFolderLink] = useState('');
  const [timeInputMethod, setTimeInputMethod] = useState<SettingsTimeInputMethodEnum | ''>(SettingsTimeInputMethodEnum.TotalHours);
  const [payPeriodInterval, setPayPeriodInterval] = useState<SettingsPayPeriodIntervalEnum | ''>(
    SettingsPayPeriodIntervalEnum.BiWeekly,
  );
  const [payPeriodStartDate, setPayPeriodStartDate] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const createClient = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;

    setSubmitted(true);
    setErrorMessage(null);

    const trimmedClientName = clientName.trim();
    const trimmedClientCode = clientCode.trim();
    const trimmedEmployeePayrollFolderLink = employeePayrollFolderLink.trim();
    const trimmedRootFolderLink = rootFolderLink.trim();
    const trimmedPayrollConfigFolderLink = payrollConfigFolderLink.trim();
    const trimmedPayrollReportFolderLink = payrollReportFolderLink.trim();

    if (
      !trimmedClientName ||
      !trimmedClientCode ||
      (employeePayrollFolderMode === 'createNew' && !trimmedRootFolderLink) ||
      (employeePayrollFolderMode === 'existing' && !trimmedEmployeePayrollFolderLink) ||
      (payrollConfigFolderMode === 'existing' && !trimmedPayrollConfigFolderLink) ||
      (payrollReportFolderMode === 'existing' && !trimmedPayrollReportFolderLink) ||
      !timeInputMethod ||
      !payPeriodInterval ||
      !payPeriodStartDate
    ) {
      return;
    }

    setSaving(true);

    try {
      const client = await clientApi.v1CreateClient({
        clientCreateRequest: {
          clientName: trimmedClientName,
          clientCode: trimmedClientCode,
          employeePayrollFolder:
            employeePayrollFolderMode === 'createNew'
              ? { createNew: true, rootFolderLink: trimmedRootFolderLink }
              : { link: trimmedEmployeePayrollFolderLink },
          payrollConfigFolder:
            payrollConfigFolderMode === 'createNew' ? { createNew: true } : { link: trimmedPayrollConfigFolderLink },
          payrollReportFolder:
            payrollReportFolderMode === 'createNew' ? { createNew: true } : { link: trimmedPayrollReportFolderLink },
          settings: {
            timeInputMethod,
            payPeriodInterval,
            payPeriodStartDate: new Date(`${payPeriodStartDate}T00:00:00.000Z`),
          },
        },
      });
      showToast('Client created.', 'success');
      navigate(`/client/${client.clientId}`);
    } catch (error) {
      console.error('Failed to create client.', error);
      const message = await resolveErrorMessage(error, partialFailureFallbackMessage);
      setErrorMessage(message);
      showToast(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return {
    advancedOpen,
    clientCode,
    clientCodeRequired: submitted && !clientCode.trim(),
    clientName,
    clientNameRequired: submitted && !clientName.trim(),
    createClient,
    employeePayrollFolderLink,
    employeePayrollFolderLinkRequired: submitted && employeePayrollFolderMode === 'existing' && !employeePayrollFolderLink.trim(),
    employeePayrollFolderMode,
    errorMessage,
    payPeriodInterval,
    payPeriodIntervalRequired: submitted && !payPeriodInterval,
    payPeriodStartDate,
    payPeriodStartDateRequired: submitted && !payPeriodStartDate,
    payrollConfigFolderLink,
    payrollConfigFolderLinkRequired: submitted && payrollConfigFolderMode === 'existing' && !payrollConfigFolderLink.trim(),
    payrollConfigFolderMode,
    payrollReportFolderLink,
    payrollReportFolderLinkRequired: submitted && payrollReportFolderMode === 'existing' && !payrollReportFolderLink.trim(),
    payrollReportFolderMode,
    rootFolderLink,
    rootFolderLinkRequired: submitted && employeePayrollFolderMode === 'createNew' && !rootFolderLink.trim(),
    saving,
    setAdvancedOpen,
    setClientCode,
    setClientName,
    setEmployeePayrollFolderLink,
    setEmployeePayrollFolderMode,
    setPayPeriodInterval,
    setPayPeriodStartDate,
    setPayrollConfigFolderLink,
    setPayrollConfigFolderMode,
    setPayrollReportFolderLink,
    setPayrollReportFolderMode,
    setRootFolderLink,
    setTimeInputMethod,
    timeInputMethod,
    timeInputMethodRequired: submitted && !timeInputMethod,
  };
};

export default useClientCreateForm;
