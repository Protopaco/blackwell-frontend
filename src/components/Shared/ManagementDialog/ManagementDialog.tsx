import type { ReactNode } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

type Props = {
  children: ReactNode;
  errorMessage: string | null;
  formId: string;
  onClose: () => void;
  open: boolean;
  saving: boolean;
  submitLabel: string;
  title: string;
};

const ManagementDialog = ({ children, errorMessage, formId, onClose, open, saving, submitLabel, title }: Props) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {children}
          {errorMessage ? (
            <Typography color="error" variant="body2">
              {errorMessage}
            </Typography>
          ) : null}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button form={formId} type="submit" variant="contained" disabled={saving} loading={saving}>
          {submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManagementDialog;
