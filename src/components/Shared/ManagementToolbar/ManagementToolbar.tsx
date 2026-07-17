import type { ReactNode } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

type Props = {
  children: ReactNode;
  primaryActionLabel: string;
  onPrimaryAction: () => void;
  primaryActionDisabled?: boolean;
};

const ManagementToolbar = ({ children, primaryActionLabel, onPrimaryAction, primaryActionDisabled = false }: Props) => {
  return (
    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
      <Stack direction="row" spacing={1} alignItems="center">
        {children}
      </Stack>
      <Button variant="contained" onClick={onPrimaryAction} disabled={primaryActionDisabled}>
        {primaryActionLabel}
      </Button>
    </Stack>
  );
};

export default ManagementToolbar;
