import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { holidayApi } from '@/api/client';
import type { Holiday } from '@/api/generated/models/Holiday';
import ManagementDialog from '@/components/Shared/ManagementDialog/ManagementDialog';
import { useToast } from '@/state/toast/toast.context';
import resolveErrorMessage from '@/utils/resolveErrorMessage';

type Props = {
  clientId: string;
  holiday: Holiday | null;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
};

const EditHolidayDialog = ({ clientId, holiday, open, onClose, onSaved }: Props) => {
  const [holidayName, setHolidayName] = useState('');
  const [holidayDate, setHolidayDate] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (!open || !holiday) return;

    setHolidayName(holiday.holidayName ?? '');
    setHolidayDate(holiday.holidayDate?.toISOString().substring(0, 10) ?? '');
    setSubmitted(false);
    setErrorMessage(null);
  }, [holiday, open]);

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

  const saveHoliday = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving || !holiday?.holidayId) return;

    setSubmitted(true);
    setErrorMessage(null);

    const trimmedHolidayName = holidayName.trim();

    if (!trimmedHolidayName || !holidayDate) return;

    setSaving(true);

    try {
      await holidayApi.v1UpdateHoliday({
        clientId,
        holidayId: holiday.holidayId,
        holiday: {
          holidayName: trimmedHolidayName,
          holidayDate: new Date(`${holidayDate}T00:00:00.000Z`),
        },
      });
      resetForm();
      onClose();
      onSaved();
      showToast('Holiday updated.', 'success');
    } catch (error) {
      console.error('Failed to update holiday.', error);
      const message = await resolveErrorMessage(error, 'Failed to update holiday.');
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
      formId="edit-holiday-form"
      onClose={closeDialog}
      open={open}
      saving={saving}
      submitLabel="Save"
      title="Edit Holiday"
    >
      <Stack component="form" id="edit-holiday-form" spacing={2} onSubmit={saveHoliday} noValidate>
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

export default EditHolidayDialog;
