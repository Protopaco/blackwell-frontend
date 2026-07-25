import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { payPeriodApi } from '@/api/client';
import DashboardCard from '@/components/Shared/DashboardCard/DashboardCard';
import DashboardList from '@/components/Shared/DashboardList/DashboardList';
import useAsyncAction from '@/hooks/useAsyncAction';
import firstTimesheetGenerated from '@/models/firstTimesheetGenerated';
import formatUTCDateMedium from '@/utils/formatUTCDateMedium';
import type { Holiday } from '@/api/generated/models/Holiday';
import type { PayPeriodStatusEnum } from '@/api/generated/models/PayPeriod';

type Props = {
  clientId: string;
  payPeriodId: string;
  holidays: Holiday[];
  payPeriodStatus: PayPeriodStatusEnum | undefined;
  onHolidaysChanged: () => void;
};

const syncLockedMessage = 'A timesheet has already been generated for this pay period.';

const HolidaysCard = ({ clientId, payPeriodId, holidays, payPeriodStatus, onHolidaysChanged }: Props) => {
  const syncLocked = firstTimesheetGenerated(payPeriodStatus);

  const { run: syncHolidays, loading: syncing } = useAsyncAction(
    async () => {
      await payPeriodApi.v1SyncHolidaysOnPayPeriod({ clientId, payPeriodId });
      onHolidaysChanged();
    },
    'Failed to sync holidays.',
    'Holidays synced.'
  );

  return (
    <DashboardCard
      id="holidays-card"
      header="Holidays"
      configPath={null}
      headerAction={
        <Tooltip title={syncLocked ? syncLockedMessage : ''}>
          <span>
            <Button variant="outlined" size="small" onClick={syncHolidays} disabled={syncLocked || syncing} loading={syncing}>
              Sync
            </Button>
          </span>
        </Tooltip>
      }
    >
      <DashboardList
        items={holidays.map((holiday) => ({
          key: holiday.holidayName ?? '',
          labels: [holiday.holidayName ?? '', formatUTCDateMedium(holiday.holidayDate)],
        }))}
      />
    </DashboardCard>
  );
};

export default HolidaysCard;
