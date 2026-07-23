export type ToastSeverity = 'success' | 'error' | 'warning' | 'info';

export type Toast = {
  id: string;
  message: string;
  severity: ToastSeverity;
};

export type ToastContextValue = {
  showToast: (message: string, severity: ToastSeverity) => void;
};
