import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { payPeriodApi } from '@/api/client';
import useAsyncAction from '@/hooks/useAsyncAction';
import PayPeriodStatusChip from '@/components/Shared/PayPeriodStatusChip/PayPeriodStatusChip';
import formatUTCDateMedium from '@/utils/formatUTCDateMedium';
import resolveErrorMessage from '@/utils/resolveErrorMessage';
import type { PayPeriod } from '@/api/generated/models/PayPeriod';

type Props = {
  clientId: string;
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

const CreatePayPeriodDialog = ({ clientId, open, onClose, onCreated }: Props) => {
  const [suggested, setSuggested] = useState<PayPeriod | null>(null);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [suggestionErrorMessage, setSuggestionErrorMessage] = useState<string | null>(null);

  const { run: runCreate, loading: creating, errorMessage: createErrorMessage } = useAsyncAction(
    async () => {
      await payPeriodApi.v1CreatePayPeriod({ clientId });
      onCreated();
      onClose();
    },
    'Failed to create pay period.',
    'Pay period created.'
  );

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    setSuggested(null);
    setSuggestionErrorMessage(null);
    setLoadingSuggestion(true);

    payPeriodApi
      .v1GetNextPayPeriod({ clientId })
      .then((payPeriod) => {
        if (cancelled) return;
        setSuggested(payPeriod);
      })
      .catch(async (error) => {
        console.error('Failed to load suggested pay period.', error);
        if (cancelled) return;
        setSuggestionErrorMessage(await resolveErrorMessage(error, 'Failed to load suggested pay period.'));
      })
      .finally(() => {
        if (cancelled) return;
        setLoadingSuggestion(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, clientId]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create Pay Period</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {loadingSuggestion ? (
            <Stack alignItems="center" sx={{ py: 2 }}>
              <CircularProgress size={24} />
            </Stack>
          ) : suggestionErrorMessage ? (
            <Typography color="error" variant="body2">
              {suggestionErrorMessage}
            </Typography>
          ) : suggested ? (
            <Stack spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                <Typography variant="h6">{suggested.payPeriodName}</Typography>
                {suggested.status ? <PayPeriodStatusChip status={suggested.status} /> : null}
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {formatUTCDateMedium(suggested.startDate)} – {formatUTCDateMedium(suggested.endDate)}
              </Typography>
            </Stack>
          ) : null}
          {createErrorMessage ? (
            <Typography color="error" variant="body2">
              {createErrorMessage}
            </Typography>
          ) : null}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={creating}>
          Cancel
        </Button>
        <Button
          onClick={runCreate}
          variant="contained"
          disabled={creating || loadingSuggestion || !suggested}
          loading={creating}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePayPeriodDialog;
