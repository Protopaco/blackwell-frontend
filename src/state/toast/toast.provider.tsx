import { useEffect, useState } from 'react';
import type { ReactNode, SyntheticEvent } from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { ToastContext } from '@/state/toast/toast.context';
import type { Toast, ToastSeverity } from '@/state/toast/toast.types';

const AUTO_HIDE_DURATION_MS = 6000;

const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [queue, setQueue] = useState<Toast[]>([]);
  const [activeToast, setActiveToast] = useState<Toast | null>(null);
  const [open, setOpen] = useState(false);

  const showToast = (message: string, severity: ToastSeverity) => {
    setQueue((prev) => [...prev, { id: crypto.randomUUID(), message, severity }]);
  };

  // Shows toasts one at a time: when nothing is active, pull the next one off the queue;
  // if a new toast arrives while one is showing, close the current one first so its exit
  // transition can hand off to the next (see handleExited).
  useEffect(() => {
    if (!activeToast && queue.length > 0) {
      setActiveToast(queue[0]);
      setQueue((prev) => prev.slice(1));
      setOpen(true);
    } else if (activeToast && open && queue.length > 0) {
      setOpen(false);
    }
  }, [activeToast, open, queue]);

  const handleClose = (_event: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  const handleExited = () => {
    setActiveToast(null);
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
