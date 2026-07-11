import DashboardCard from '@/components/Shared/DashboardCard/DashboardCard';
import DashboardList from '@/components/Shared/DashboardList/DashboardList';
import formatUTCDateMedium from '@/utils/formatUTCDateMedium';
import { SettingsTimeInputMethodEnum, type Settings } from '@/api/generated/models/Settings';

type Props = {
  settings: Settings;
};

const timeInputMethodLabels: Record<SettingsTimeInputMethodEnum, string> = {
  [SettingsTimeInputMethodEnum.TotalHours]: 'Total Hours',
  [SettingsTimeInputMethodEnum.ClockInOut]: 'Clock In/Out',
};

const ClientSettingsCard = ({ settings }: Props) => {
  return (
    <DashboardCard id="client-settings-card" header="Settings" configPath={null}>
      <DashboardList
        items={[
          {
            key: 'timeInputMethod',
            labels: ['Time Input Method', settings.timeInputMethod ? timeInputMethodLabels[settings.timeInputMethod] : ''],
          },
          { key: 'payPeriodInterval', labels: ['Pay Period Interval', settings.payPeriodInterval ?? ''] },
          { key: 'payPeriodStartDate', labels: ['Pay Period Start Date', formatUTCDateMedium(settings.payPeriodStartDate)] },
        ]}
      />
    </DashboardCard>
  );
};

export default ClientSettingsCard;
