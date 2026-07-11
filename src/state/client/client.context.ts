import { createContext, useContext } from 'react';
import type { ClientState, ClientAction } from '@/state/client/client.types';

export const ClientContext = createContext<{ state: ClientState; dispatch: React.Dispatch<ClientAction> } | undefined>(undefined);

export const useClient = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClient must be used inside ClientProvider');
  }
  return context;
};
