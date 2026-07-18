import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import type { TimesheetFolder } from '@/api/generated/models/TimesheetFolder';

type TimesheetSetupMode = 'newWorkbook' | 'existingWorkbook';

type Props = {
  disabled: boolean;
  loadingTimesheetFolders: boolean;
  noActiveTimesheetFolders: boolean;
  onTimesheetFileLinkChange: (value: string) => void;
  onTimesheetFolderIdChange: (value: string) => void;
  onTimesheetSetupModeChange: (value: TimesheetSetupMode) => void;
  timesheetFileLink: string;
  timesheetFileLinkRequired: boolean;
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
  onTimesheetFileLinkChange,
  onTimesheetFolderIdChange,
  onTimesheetSetupModeChange,
  timesheetFileLink,
  timesheetFileLinkRequired,
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
        <RadioGroup value={timesheetSetupMode} onChange={(event) => onTimesheetSetupModeChange(event.target.value as TimesheetSetupMode)}>
          <Stack spacing={1.5}>
            <Box>
              <FormControlLabel value="newWorkbook" control={<Radio />} label="Create New" />
              {timesheetSetupMode === 'newWorkbook' ? (
                <Box sx={{ ml: 4 }}>
                  <FormControl
                    fullWidth
                    required
                    error={timesheetFolderRequired || Boolean(timesheetFolderErrorMessage) || noActiveTimesheetFolders}
                    disabled={disabled || loadingTimesheetFolders}
                  >
                    <InputLabel id="employee-timesheet-folder-label">Destination folder</InputLabel>
                    <Select
                      labelId="employee-timesheet-folder-label"
                      label="Destination folder"
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
                    {timesheetFolderRequired ? <FormHelperText>Destination folder is required.</FormHelperText> : null}
                    {noActiveTimesheetFolders ? <FormHelperText>No active timesheet folders.</FormHelperText> : null}
                  </FormControl>
                </Box>
              ) : null}
            </Box>
            <Box>
              <FormControlLabel value="existingWorkbook" control={<Radio />} label="Use Existing" />
              {timesheetSetupMode === 'existingWorkbook' ? (
                <Box sx={{ ml: 4 }}>
                  <TextField
                    disabled={disabled}
                    error={timesheetFileLinkRequired}
                    fullWidth
                    helperText={timesheetFileLinkRequired ? 'Timesheet URL is required.' : undefined}
                    label="Timesheet URL"
                    onChange={(event) => onTimesheetFileLinkChange(event.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    required
                    value={timesheetFileLink}
                  />
                </Box>
              ) : null}
            </Box>
          </Stack>
        </RadioGroup>
      </FormControl>
    </>
  );
};

export default EmployeeTimesheetSetupFields;
