import { createContext, useContext } from 'react';
import type { ToastContextValue } from '@/state/toast/toast.types';

export const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used inside ToastProvider');
  }
  return context;
};
