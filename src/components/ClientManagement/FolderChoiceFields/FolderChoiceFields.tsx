import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

export type FolderChoiceMode = 'createNew' | 'existing';

type Props = {
  createNewExtraField?: ReactNode;
  disabled: boolean;
  label: string;
  linkRequired: boolean;
  linkValue: string;
  mode: FolderChoiceMode;
  onLinkChange: (value: string) => void;
  onModeChange: (mode: FolderChoiceMode) => void;
};

const FolderChoiceFields = ({
  createNewExtraField,
  disabled,
  label,
  linkRequired,
  linkValue,
  mode,
  onLinkChange,
  onModeChange,
}: Props) => {
  return (
    <FormControl disabled={disabled}>
      <FormLabel>{label}</FormLabel>
      <RadioGroup value={mode} onChange={(event) => onModeChange(event.target.value as FolderChoiceMode)}>
        <Stack spacing={1.5}>
          <Box>
            <FormControlLabel value="createNew" control={<Radio />} label="Create new" />
            {mode === 'createNew' && createNewExtraField ? <Box sx={{ ml: 4 }}>{createNewExtraField}</Box> : null}
          </Box>
          <Box>
            <FormControlLabel value="existing" control={<Radio />} label="Use existing link" />
            {mode === 'existing' ? (
              <Box sx={{ ml: 4 }}>
                <TextField
                  disabled={disabled}
                  error={linkRequired}
                  fullWidth
                  helperText={linkRequired ? 'Folder URL is required.' : undefined}
                  label="Folder URL"
                  onChange={(event) => onLinkChange(event.target.value)}
                  placeholder="https://drive.google.com/drive/folders/..."
                  required
                  value={linkValue}
                />
              </Box>
            ) : null}
          </Box>
        </Stack>
      </RadioGroup>
    </FormControl>
  );
};

export default FolderChoiceFields;
