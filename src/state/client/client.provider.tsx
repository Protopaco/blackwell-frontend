import { useReducer, useMemo, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { clientReducer } from '@/state/client/client.reducer';
import { ClientContext } from '@/state/client/client.context';
import { ClientActionType } from '@/state/client/client.types';
import type { ClientState } from '@/state/client/client.types';
import { clientApi } from '@/api/client';

const initialState: ClientState = {
  clients: [],
  loading: true,
};

const ClientProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(clientReducer, initialState);
  const booted = useRef(false);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  useEffect(() => {
    if (booted.current) return;
    booted.current = true;

    clientApi.v1GetClients().then((clients) => {
      dispatch({ type: ClientActionType.SET_CLIENTS, payload: clients });
    });
  }, []);

  return <ClientContext.Provider value={value}>{children}</ClientContext.Provider>;
};

export default ClientProvider;
