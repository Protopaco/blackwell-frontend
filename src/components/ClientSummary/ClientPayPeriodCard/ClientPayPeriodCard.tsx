import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import HistoryIcon from '@mui/icons-material/History';
import DashboardCard from '@/components/Shared/DashboardCard/DashboardCard';
import DashboardList from '@/components/Shared/DashboardList/DashboardList';
import PayPeriodStatusChip from '@/components/Shared/PayPeriodStatusChip/PayPeriodStatusChip';
import CreatePayPeriodDialog from '@/components/ClientSummary/ClientPayPeriodCard/CreatePayPeriodDialog/CreatePayPeriodDialog';
import PayPeriodHistoryDialog from '@/components/ClientSummary/ClientPayPeriodCard/PayPeriodHistoryDialog/PayPeriodHistoryDialog';
import type { PayPeriod } from '@/api/generated/models/PayPeriod';

type Props = {
  payPeriods: PayPeriod[];
  onPayPeriodCreated: () => void;
};

const ClientPayPeriodCard = ({ payPeriods, onPayPeriodCreated }: Props) => {
  const { clientId } = useParams<{ clientId: string }>();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);

  return (
    <DashboardCard
      id="client-pay-period-card"
      header="Pay Periods"
      configPath={null}
      headerAction={
        <IconButton size="small" aria-label="Pay period history" onClick={() => setHistoryDialogOpen(true)}>
          <HistoryIcon fontSize="small" />
        </IconButton>
      }
    >
      <Stack spacing={1}>
        <DashboardList
          items={payPeriods.map((payPeriod) => ({
            key: payPeriod.payPeriodId ?? '',
            labels: [payPeriod.payPeriodName ?? ''],
            endAdornment: payPeriod.status ? <PayPeriodStatusChip status={payPeriod.status} /> : null,
            path: payPeriod.payPeriodId ? `/client/${clientId}/payPeriod/${payPeriod.payPeriodId}` : null,
          }))}
        />
        <Button size="small" onClick={() => setCreateDialogOpen(true)}>
          + Create Pay Period
        </Button>
      </Stack>
      {clientId ? (
        <>
          <CreatePayPeriodDialog
            clientId={clientId}
            open={createDialogOpen}
            onClose={() => setCreateDialogOpen(false)}
            onCreated={onPayPeriodCreated}
          />
          <PayPeriodHistoryDialog clientId={clientId} open={historyDialogOpen} onClose={() => setHistoryDialogOpen(false)} />
        </>
      ) : null}
    </DashboardCard>
  );
};

export default ClientPayPeriodCard;
