import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientApi, settingsApi } from '@/api/client';
import { SettingsPayPeriodIntervalEnum, SettingsTimeInputMethodEnum } from '@/api/generated/models/Settings';
import useFetchByKey from '@/hooks/useFetchByKey';
import { useToast } from '@/state/toast/toast.context';
import resolveErrorMessage from '@/utils/resolveErrorMessage';

// Converts a date-only Date (parsed as UTC midnight by the generated client) to a "YYYY-MM-DD" string
// for the date TextField — using UTC components avoids shifting the displayed day in timezones behind UTC.
const toDateInputValue = (date: Date | undefined): string => {
  if (!date) return '';
  return date.toISOString().split('T')[0];
};

const useClientSettingsForm = (clientId: string | undefined) => {
  const [timeInputMethod, setTimeInputMethod] = useState<SettingsTimeInputMethodEnum | ''>('');
  const [payPeriodInterval, setPayPeriodInterval] = useState<SettingsPayPeriodIntervalEnum | ''>('');
  const [payPeriodStartDate, setPayPeriodStartDate] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const {
    data: summary,
    errorMessage: loadErrorMessage,
    loading,
  } = useFetchByKey(clientId, (clientId) => clientApi.v1GetClientSummary({ clientId }), 'Failed to load settings.');

  const hasPayPeriods = (summary?.payPeriods?.length ?? 0) > 0;

  useEffect(() => {
    if (!summary?.settings) return;

    setTimeInputMethod(summary.settings.timeInputMethod ?? '');
    setPayPeriodInterval(summary.settings.payPeriodInterval ?? '');
    setPayPeriodStartDate(toDateInputValue(summary.settings.payPeriodStartDate));
  }, [summary]);

  const saveSettings = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving || !clientId) return;

    setSubmitted(true);
    setErrorMessage(null);

    if (!timeInputMethod || !payPeriodInterval || !payPeriodStartDate) return;

    setSaving(true);

    try {
      await settingsApi.v1UpdateSettings({
        clientId,
        settings: {
          timeInputMethod,
          payPeriodInterval,
          payPeriodStartDate: new Date(`${payPeriodStartDate}T00:00:00.000Z`),
        },
      });
      showToast('Settings updated.', 'success');
      navigate(`/client/${clientId}`);
    } catch (error) {
      console.error('Failed to update settings.', error);
      const message = await resolveErrorMessage(error, 'Failed to update settings.');
      setErrorMessage(message);
      showToast(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return {
    errorMessage,
    hasPayPeriods,
    loading,
    loadErrorMessage,
    payPeriodInterval,
    payPeriodIntervalRequired: submitted && !payPeriodInterval,
    payPeriodStartDate,
    payPeriodStartDateRequired: submitted && !payPeriodStartDate,
    saveSettings,
    saving,
    setPayPeriodInterval,
    setPayPeriodStartDate,
    setTimeInputMethod,
    timeInputMethod,
    timeInputMethodRequired: submitted && !timeInputMethod,
  };
};

export default useClientSettingsForm;
