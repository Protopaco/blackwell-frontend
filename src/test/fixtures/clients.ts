import type { Client } from '@/api/generated/models/Client';

const mockClients: Client[] = [
  { clientId: '1', clientName: 'Acme Nonprofit', clientCode: 'ACME' },
  { clientId: '2', clientName: 'Riverside Services', clientCode: 'RVS' },
];

export default mockClients;
