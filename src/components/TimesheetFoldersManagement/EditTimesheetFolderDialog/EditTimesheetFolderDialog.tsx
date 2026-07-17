import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { timesheetFolderApi } from '@/api/client';
import { TimesheetFolderStatusEnum } from '@/api/generated/models/TimesheetFolder';
import type { TimesheetFolder } from '@/api/generated/models/TimesheetFolder';
import ManagementDialog from '@/components/Shared/ManagementDialog/ManagementDialog';
import resolveErrorMessage from '@/utils/resolveErrorMessage';

type Props = {
  clientId: string;
  open: boolean;
  timesheetFolder: TimesheetFolder | null;
  onClose: () => void;
  onSaved: () => void;
};

const EditTimesheetFolderDialog = ({ clientId, open, timesheetFolder, onClose, onSaved }: Props) => {
  const [timesheetFolderName, setTimesheetFolderName] = useState('');
  const [status, setStatus] = useState<TimesheetFolderStatusEnum | ''>('');
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !timesheetFolder) return;

    setTimesheetFolderName(timesheetFolder.timesheetFolderName ?? '');
    setStatus(timesheetFolder.status ?? '');
    setSubmitted(false);
    setErrorMessage(null);
  }, [open, timesheetFolder]);

  const resetForm = () => {
    setTimesheetFolderName('');
    setStatus('');
    setSubmitted(false);
    setErrorMessage(null);
  };

  const closeDialog = () => {
    if (saving) return;
    resetForm();
    onClose();
  };

  const updateStatus = (event: SelectChangeEvent) => {
    setStatus(event.target.value as TimesheetFolderStatusEnum);
  };

  const updateTimesheetFolder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving || !timesheetFolder?.timesheetFolderId) return;

    setSubmitted(true);
    setErrorMessage(null);

    const trimmedTimesheetFolderName = timesheetFolderName.trim();

    if (!trimmedTimesheetFolderName || !status) return;

    setSaving(true);

    try {
      await timesheetFolderApi.v1UpdateTimesheetFolder({
        clientId,
        timesheetFolderId: timesheetFolder.timesheetFolderId,
        timesheetFolderUpdateRequest: {
          timesheetFolderName: trimmedTimesheetFolderName,
          status,
        },
      });
      resetForm();
      onClose();
      onSaved();
    } catch (error) {
      console.error('Failed to update timesheet folder.', error);
      setErrorMessage(await resolveErrorMessage(error, 'Failed to update timesheet folder.'));
    } finally {
      setSaving(false);
    }
  };

  const nameRequired = submitted && !timesheetFolderName.trim();
  const statusRequired = submitted && !status;
  const driveFolderUrl = timesheetFolder?.driveFolderId ? `https://drive.google.com/drive/folders/${timesheetFolder.driveFolderId}` : null;

  return (
    <ManagementDialog
      errorMessage={errorMessage}
      formId="edit-timesheet-folder-form"
      onClose={closeDialog}
      open={open}
      saving={saving}
      submitLabel="Save"
      title="Edit Timesheet Folder"
    >
      <Stack component="form" id="edit-timesheet-folder-form" spacing={2} onSubmit={updateTimesheetFolder} noValidate>
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
        <FormControl fullWidth required error={statusRequired} disabled={saving}>
          <InputLabel id="timesheet-folder-status-label">Status</InputLabel>
          <Select labelId="timesheet-folder-status-label" label="Status" value={status} onChange={updateStatus}>
            <MenuItem value={TimesheetFolderStatusEnum.Active}>Active</MenuItem>
            <MenuItem value={TimesheetFolderStatusEnum.Inactive}>Inactive</MenuItem>
          </Select>
          {statusRequired ? <FormHelperText>Status is required.</FormHelperText> : null}
        </FormControl>
        <TextField
          fullWidth
          label="Drive folder ID"
          value={timesheetFolder?.driveFolderId ?? ''}
          disabled
          slotProps={{
            input: {
              readOnly: true,
              endAdornment: driveFolderUrl ? (
                <InputAdornment position="end">
                  <IconButton aria-label="Open Drive folder" component="a" href={driveFolderUrl} rel="noreferrer" target="_blank" size="small">
                    <OpenInNewIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : undefined,
            },
          }}
        />
      </Stack>
    </ManagementDialog>
  );
};

export default EditTimesheetFolderDialog;
