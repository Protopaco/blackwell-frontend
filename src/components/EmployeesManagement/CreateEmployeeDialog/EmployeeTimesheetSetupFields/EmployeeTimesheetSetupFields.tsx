import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import type { TimesheetFolder } from '@/api/generated/models/TimesheetFolder';

type TimesheetSetupMode = 'newWorkbook' | 'existingWorkbook';

type Props = {
  disabled: boolean;
  loadingTimesheetFolders: boolean;
  noActiveTimesheetFolders: boolean;
  onTimesheetFileIdChange: (value: string) => void;
  onTimesheetFolderIdChange: (value: string) => void;
  onTimesheetSetupModeChange: (value: TimesheetSetupMode) => void;
  timesheetFileId: string;
  timesheetFileRequired: boolean;
  timesheetFolderErrorMessage: string | null;
  timesheetFolderId: string;
  timesheetFolderRequired: boolean;
  timesheetFolders: TimesheetFolder[];
  timesheetSetupMode: TimesheetSetupMode;
};

const EmployeeTimesheetSetupFields = ({
  disabled,
  loadingTimesheetFolders,
  noActiveTimesheetFolders,
  onTimesheetFileIdChange,
  onTimesheetFolderIdChange,
  onTimesheetSetupModeChange,
  timesheetFileId,
  timesheetFileRequired,
  timesheetFolderErrorMessage,
  timesheetFolderId,
  timesheetFolderRequired,
  timesheetFolders,
  timesheetSetupMode,
}: Props) => {
  return (
    <>
      <FormControl disabled={disabled}>
        <FormLabel>Timesheet setup</FormLabel>
        <RadioGroup
          row
          value={timesheetSetupMode}
          onChange={(event) => onTimesheetSetupModeChange(event.target.value as TimesheetSetupMode)}
        >
          <FormControlLabel value="newWorkbook" control={<Radio />} label="Create new timesheet workbook" />
          <FormControlLabel value="existingWorkbook" control={<Radio />} label="Use existing timesheet workbook" />
        </RadioGroup>
      </FormControl>
      {timesheetSetupMode === 'newWorkbook' ? (
        <FormControl
          fullWidth
          required
          error={timesheetFolderRequired || Boolean(timesheetFolderErrorMessage) || noActiveTimesheetFolders}
          disabled={disabled || loadingTimesheetFolders}
        >
          <InputLabel id="employee-timesheet-folder-label">Timesheet folder</InputLabel>
          <Select
            labelId="employee-timesheet-folder-label"
            label="Timesheet folder"
            value={timesheetFolderId}
            onChange={(event) => onTimesheetFolderIdChange(event.target.value)}
          >
            {timesheetFolders.map((timesheetFolder) => (
              <MenuItem
                key={timesheetFolder.timesheetFolderId ?? timesheetFolder.timesheetFolderName ?? ''}
                value={timesheetFolder.timesheetFolderId ?? ''}
              >
                {timesheetFolder.timesheetFolderName}
              </MenuItem>
            ))}
          </Select>
          {timesheetFolderErrorMessage ? <FormHelperText>{timesheetFolderErrorMessage}</FormHelperText> : null}
          {timesheetFolderRequired ? <FormHelperText>Timesheet folder is required.</FormHelperText> : null}
          {noActiveTimesheetFolders ? <FormHelperText>No active timesheet folders.</FormHelperText> : null}
        </FormControl>
      ) : (
        <TextField
          disabled={disabled}
          error={timesheetFileRequired}
          fullWidth
          helperText={timesheetFileRequired ? 'Timesheet file ID is required.' : undefined}
          label="Timesheet file ID"
          onChange={(event) => onTimesheetFileIdChange(event.target.value)}
          required
          value={timesheetFileId}
        />
      )}
    </>
  );
};

export default EmployeeTimesheetSetupFields;
