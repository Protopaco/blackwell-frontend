import type { ReactNode } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

type Props = {
  body: ReactNode;
  confirmLabel?: string;
  errorMessage: string | null;
  onClose: () => void;
  onConfirm: () => void;
  open: boolean;
  saving: boolean;
  title: string;
};

const DeleteConfirmationDialog = ({ body, confirmLabel = 'Delete', errorMessage, onClose, onConfirm, open, saving, title }: Props) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <DialogContentText>{body}</DialogContentText>
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
        <Button color="error" onClick={onConfirm} variant="contained" disabled={saving} loading={saving}>
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
