import DashboardCard from '@/components/Shared/DashboardCard/DashboardCard';
import DashboardList from '@/components/Shared/DashboardList/DashboardList';
import type { Supervisor } from '@/api/generated/models';

type Props = {
  supervisors: Supervisor[];
};

const ClientSupervisorsCard = ({ supervisors }: Props) => {
  return (
    <DashboardCard id="client-supervisors-card" header="Supervisors" configPath={null}>
      <DashboardList
        items={supervisors.map((supervisor) => ({
          key: supervisor.supervisorId ?? `${supervisor.firstName}-${supervisor.lastName}`,
          labels: [`${supervisor.firstName} ${supervisor.lastName}`],
        }))}
      />
    </DashboardCard>
  );
};

export default ClientSupervisorsCard;
