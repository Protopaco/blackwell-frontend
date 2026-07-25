import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import HolidaysCard from '@/components/PayPeriodDashboard/HolidaysCard/HolidaysCard';
import PayPeriodInfoCard from '@/components/PayPeriodDashboard/PayPeriodInfoCard/PayPeriodInfoCard';
import NavButton from '@/components/Shared/NavButton/NavButton';
import NavIcon from '@/models/NavIcon';
import type { Holiday } from '@/api/generated/models/Holiday';
import type { PayPeriod } from '@/api/generated/models/PayPeriod';

type Props = {
  clientId: string;
  payPeriodId: string;
  payPeriod: PayPeriod;
  holidays: Holiday[];
  onHolidaysChanged: () => void;
};

const PayPeriodHeader = ({ clientId, payPeriodId, payPeriod, holidays, onHolidaysChanged }: Props) => {
  return (
    <Stack spacing={3}>
      <Box>
        <NavButton label="Client Summary" path={`/client/${clientId}`} navIcon={NavIcon.Back} />
      </Box>
      <Stack direction="row" spacing={3} alignItems="flex-start">
        <Box sx={{ flex: '0 1 auto', minWidth: 280 }}>
          <PayPeriodInfoCard payPeriod={payPeriod} />
        </Box>
        <Box sx={{ flex: '0 1 auto', minWidth: 280 }}>
          <HolidaysCard
            clientId={clientId}
            payPeriodId={payPeriodId}
            holidays={holidays}
            payPeriodStatus={payPeriod.status}
            onHolidaysChanged={onHolidaysChanged}
          />
        </Box>
      </Stack>
    </Stack>
  );
};

export default PayPeriodHeader;
