import DashboardCard from '@/components/Shared/DashboardCard/DashboardCard';
import DashboardList from '@/components/Shared/DashboardList/DashboardList';
import formatUTCDateMedium from '@/utils/formatUTCDateMedium';
import type { Holiday } from '@/api/generated/models/Holiday';

type Props = {
  clientId: string;
  holidays: Holiday[];
};

const ClientHolidaysCard = ({ clientId, holidays }: Props) => {
  const sortedHolidays = [...holidays].sort((a, b) => (a.holidayDate?.getTime() ?? 0) - (b.holidayDate?.getTime() ?? 0));

  return (
    <DashboardCard id="client-holidays-card" header="Holidays" configPath={`/client/${clientId}/holidays`}>
      <DashboardList
        items={sortedHolidays.map((holiday) => ({
          key: holiday.holidayId ?? holiday.holidayName ?? '',
          labels: [holiday.holidayName ?? '', formatUTCDateMedium(holiday.holidayDate)],
        }))}
      />
    </DashboardCard>
  );
};

export default ClientHolidaysCard;
