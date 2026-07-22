import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { payPeriodApi } from '@/api/client';
import DashboardList from '@/components/Shared/DashboardList/DashboardList';
import PayPeriodStatusChip from '@/components/Shared/PayPeriodStatusChip/PayPeriodStatusChip';
import resolveErrorMessage from '@/utils/resolveErrorMessage';
import type { PayPeriod } from '@/api/generated/models/PayPeriod';

type Props = {
  clientId: string;
  open: boolean;
  onClose: () => void;
};

const PayPeriodHistoryDialog = ({ clientId, open, onClose }: Props) => {
  const [payPeriods, setPayPeriods] = useState<PayPeriod[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    setPayPeriods(null);
    setErrorMessage(null);
    setLoading(true);

    payPeriodApi
      .v1GetPayPeriods({ clientId })
      .then((result) => {
        if (cancelled) return;
        setPayPeriods(result);
      })
      .catch(async (error) => {
        console.error('Failed to load pay period history.', error);
        if (cancelled) return;
        setErrorMessage(await resolveErrorMessage(error, 'Failed to load pay period history.'));
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, clientId]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Pay Period History</DialogTitle>
      <DialogContent>
        {loading ? (
          <Stack alignItems="center" sx={{ py: 2 }}>
            <CircularProgress size={24} />
          </Stack>
        ) : errorMessage ? (
          <Typography color="error" variant="body2">
            {errorMessage}
          </Typography>
        ) : payPeriods && payPeriods.length > 0 ? (
          <DashboardList
            onNavigate={onClose}
            items={payPeriods.map((payPeriod) => ({
              key: payPeriod.payPeriodId ?? '',
              labels: [payPeriod.payPeriodName ?? ''],
              endAdornment: payPeriod.status ? <PayPeriodStatusChip status={payPeriod.status} /> : null,
              path: payPeriod.payPeriodId ? `/client/${clientId}/payPeriod/${payPeriod.payPeriodId}` : null,
            }))}
          />
        ) : (
          <Typography variant="body2" color="text.secondary">
            No pay periods.
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PayPeriodHistoryDialog;
