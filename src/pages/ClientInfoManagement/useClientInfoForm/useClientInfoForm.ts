import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientApi } from '@/api/client';
import { ClientStatusEnum } from '@/api/generated/models/Client';
import type { Client } from '@/api/generated/models/Client';
import { useClient } from '@/state/client/client.context';
import { ClientActionType } from '@/state/client/client.types';
import { useToast } from '@/state/toast/toast.context';
import resolveErrorMessage from '@/utils/resolveErrorMessage';

const useClientInfoForm = (client: Client | null) => {
  const [clientName, setClientName] = useState('');
  const [clientCode, setClientCode] = useState('');
  const [status, setStatus] = useState<ClientStatusEnum>(ClientStatusEnum.Active);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { showToast } = useToast();
  const { dispatch } = useClient();
  const navigate = useNavigate();

  useEffect(() => {
    if (!client) return;

    setClientName(client.clientName ?? '');
    setClientCode(client.clientCode ?? '');
    setStatus(client.status ?? ClientStatusEnum.Active);
  }, [client]);

  const saveClient = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving || !client?.clientId) return;

    setSubmitted(true);
    setErrorMessage(null);

    const trimmedClientName = clientName.trim();
    const trimmedClientCode = clientCode.trim();

    if (!trimmedClientName || !trimmedClientCode) return;

    setSaving(true);

    try {
      await clientApi.v1UpdateClient({
        clientId: client.clientId,
        clientUpdateRequest: {
          clientName: trimmedClientName,
          clientCode: trimmedClientCode,
          status,
        },
      });
      const clients = await clientApi.v1GetClients();
      dispatch({ type: ClientActionType.SET_CLIENTS, payload: clients });
      showToast('Client updated.', 'success');
      navigate(`/client/${client.clientId}`);
    } catch (error) {
      console.error('Failed to update client.', error);
      const message = await resolveErrorMessage(error, 'Failed to update client.');
      setErrorMessage(message);
      showToast(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return {
    clientCode,
    clientCodeRequired: submitted && !clientCode.trim(),
    clientName,
    clientNameRequired: submitted && !clientName.trim(),
    errorMessage,
    saveClient,
    saving,
    setClientCode,
    setClientName,
    setStatus,
    status,
  };
};

export default useClientInfoForm;
