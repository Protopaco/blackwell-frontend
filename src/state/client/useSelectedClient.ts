import { useParams } from 'react-router-dom';
import { useClient } from '@/state/client/client.context';
import type { Client } from '@/api/generated/models/Client';

type SelectedClient = {
  selectedClient: Client | null;
  clientsLoading: boolean;
};

/**
 * Derives the selected client from the `:clientId` URL param — the URL is the
 * source of truth, not stored state. Returns `selectedClient: null` when there
 * is no `:clientId` in the route (e.g. the landing page) or the id matches no
 * known client. `clientsLoading` is true until the client list has been fetched,
 * so callers can distinguish "still loading" from "no such client".
 */
const useSelectedClient = (): SelectedClient => {
  const { state } = useClient();
  const { clientId } = useParams<{ clientId: string }>();

  const selectedClient = clientId ? (state.clients.find((client) => client.clientId === clientId) ?? null) : null;

  return { selectedClient, clientsLoading: state.loading };
};

export default useSelectedClient;
