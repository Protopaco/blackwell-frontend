import { useState } from 'react';
import type { FormEvent } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { timesheetFolderApi } from '@/api/client';
import ManagementDialog from '@/components/Shared/ManagementDialog/ManagementDialog';
import resolveErrorMessage from '@/utils/resolveErrorMessage';

type Props = {
  clientId: string;
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

const CreateTimesheetFolderDialog = ({ clientId, open, onClose, onCreated }: Props) => {
  const [timesheetFolderName, setTimesheetFolderName] = useState('');
  const [driveFolderLink, setDriveFolderLink] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetForm = () => {
    setTimesheetFolderName('');
    setDriveFolderLink('');
    setSubmitted(false);
    setErrorMessage(null);
  };

  const closeDialog = () => {
    if (saving) return;
    resetForm();
    onClose();
  };

  const createTimesheetFolder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;

    setSubmitted(true);
    setErrorMessage(null);

    const trimmedTimesheetFolderName = timesheetFolderName.trim();
    const trimmedDriveFolderLink = driveFolderLink.trim();

    if (!trimmedTimesheetFolderName || !trimmedDriveFolderLink) return;

    setSaving(true);

    try {
      await timesheetFolderApi.v1CreateTimesheetFolder({
        clientId,
        timesheetFolderCreateRequest: {
          timesheetFolderName: trimmedTimesheetFolderName,
          driveFolderLink: trimmedDriveFolderLink,
        },
      });
      resetForm();
      onClose();
      onCreated();
    } catch (error) {
      console.error('Failed to create timesheet folder.', error);
      setErrorMessage(await resolveErrorMessage(error, 'Failed to create timesheet folder.'));
    } finally {
      setSaving(false);
    }
  };

  const nameRequired = submitted && !timesheetFolderName.trim();
  const linkRequired = submitted && !driveFolderLink.trim();

  return (
    <ManagementDialog
      errorMessage={errorMessage}
      formId="create-timesheet-folder-form"
      onClose={closeDialog}
      open={open}
      saving={saving}
      submitLabel="Create"
      title="Create Timesheet Folder"
    >
      <Stack component="form" id="create-timesheet-folder-form" spacing={2} onSubmit={createTimesheetFolder} noValidate>
        <TextField
          autoFocus
          disabled={saving}
          error={nameRequired}
          fullWidth
          helperText={nameRequired ? 'Timesheet folder name is required.' : undefined}
          label="Timesheet folder name"
          onChange={(event) => setTimesheetFolderName(event.target.value)}
          required
          value={timesheetFolderName}
        />
        <TextField
          disabled={saving}
          error={linkRequired}
          fullWidth
          helperText={linkRequired ? 'Timesheet folder link is required.' : undefined}
          label="Timesheet folder link"
          onChange={(event) => setDriveFolderLink(event.target.value)}
          required
          value={driveFolderLink}
        />
      </Stack>
    </ManagementDialog>
  );
};

export default CreateTimesheetFolderDialog;
