import { useState } from 'react';
import type { ReactNode, SyntheticEvent } from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { ToastContext } from '@/state/toast/toast.context';
import type { Toast, ToastSeverity } from '@/state/toast/toast.types';

const AUTO_HIDE_DURATION_MS = 6000;

const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [, setQueue] = useState<Toast[]>([]);
  const [activeToast, setActiveToast] = useState<Toast | null>(null);
  const [open, setOpen] = useState(false);

  // Shows toasts one at a time: if nothing is active, show the new one immediately; otherwise
  // queue it and close the current one so its exit transition can hand off to the next
  // (see handleExited).
  const showToast = (message: string, severity: ToastSeverity) => {
    const toast: Toast = { id: crypto.randomUUID(), message, severity };

    if (!activeToast) {
      setActiveToast(toast);
      setOpen(true);
      return;
    }

    if (open) {
      setOpen(false);
    }
    setQueue((prev) => [...prev, toast]);
  };

  const handleClose = (_event: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  const handleExited = () => {
    setQueue((prev) => {
      if (prev.length === 0) {
        setActiveToast(null);
        return prev;
      }

      const [next, ...rest] = prev;
      setActiveToast(next);
      setOpen(true);
      return rest;
    });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={AUTO_HIDE_DURATION_MS}
        onClose={handleClose}
        slotProps={{ transition: { onExited: handleExited } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {activeToast ? (
          <Alert onClose={handleClose} severity={activeToast.severity} variant="filled">
            {activeToast.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
