import { useState } from 'react';
import type { FormEvent } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { holidayApi } from '@/api/client';
import ManagementDialog from '@/components/Shared/ManagementDialog/ManagementDialog';
import { useToast } from '@/state/toast/toast.context';
import resolveErrorMessage from '@/utils/resolveErrorMessage';

type Props = {
  clientId: string;
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

const CreateHolidayDialog = ({ clientId, open, onClose, onCreated }: Props) => {
  const [holidayName, setHolidayName] = useState('');
  const [holidayDate, setHolidayDate] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { showToast } = useToast();

  const resetForm = () => {
    setHolidayName('');
    setHolidayDate('');
    setSubmitted(false);
    setErrorMessage(null);
  };

  const closeDialog = () => {
    if (saving) return;
    resetForm();
    onClose();
  };

  const createHoliday = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;

    setSubmitted(true);
    setErrorMessage(null);

    const trimmedHolidayName = holidayName.trim();

    if (!trimmedHolidayName || !holidayDate) return;

    setSaving(true);

    try {
      await holidayApi.v1CreateHoliday({
        clientId,
        holiday: {
          holidayName: trimmedHolidayName,
          holidayDate: new Date(`${holidayDate}T00:00:00.000Z`),
        },
      });
      resetForm();
      onClose();
      onCreated();
      showToast('Holiday created.', 'success');
    } catch (error) {
      console.error('Failed to create holiday.', error);
      const message = await resolveErrorMessage(error, 'Failed to create holiday.');
      setErrorMessage(message);
      showToast(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const nameRequired = submitted && !holidayName.trim();
  const dateRequired = submitted && !holidayDate;

  return (
    <ManagementDialog
      errorMessage={errorMessage}
      formId="create-holiday-form"
      onClose={closeDialog}
      open={open}
      saving={saving}
      submitLabel="Create"
      title="Create Holiday"
    >
      <Stack component="form" id="create-holiday-form" spacing={2} onSubmit={createHoliday} noValidate>
        <TextField
          autoFocus
          disabled={saving}
          error={nameRequired}
          fullWidth
          helperText={nameRequired ? 'Holiday name is required.' : undefined}
          label="Holiday name"
          onChange={(event) => setHolidayName(event.target.value)}
          required
          value={holidayName}
        />
        <TextField
          disabled={saving}
          error={dateRequired}
          fullWidth
          helperText={dateRequired ? 'Holiday date is required.' : undefined}
          label="Holiday date"
          onChange={(event) => setHolidayDate(event.target.value)}
          required
          slotProps={{ inputLabel: { shrink: true } }}
          type="date"
          value={holidayDate}
        />
      </Stack>
    </ManagementDialog>
  );
};

export default CreateHolidayDialog;
