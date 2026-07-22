import { useState } from 'react';
import type { FormEvent } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { fundingSourceApi } from '@/api/client';
import ManagementDialog from '@/components/Shared/ManagementDialog/ManagementDialog';
import resolveErrorMessage from '@/utils/resolveErrorMessage';

type Props = {
  clientId: string;
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

const CreateFundingSourceDialog = ({ clientId, open, onClose, onCreated }: Props) => {
  const [fundingSourceName, setFundingSourceName] = useState('');
  const [fundingSourceCode, setFundingSourceCode] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetForm = () => {
    setFundingSourceName('');
    setFundingSourceCode('');
    setSubmitted(false);
    setErrorMessage(null);
  };

  const closeDialog = () => {
    if (saving) return;
    resetForm();
    onClose();
  };

  const createFundingSource = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;

    setSubmitted(true);
    setErrorMessage(null);

    const trimmedFundingSourceName = fundingSourceName.trim();
    const trimmedFundingSourceCode = fundingSourceCode.trim();

    if (!trimmedFundingSourceName) return;

    setSaving(true);

    try {
      await fundingSourceApi.v1CreateFundingSource({
        clientId,
        fundingSource: {
          fundingSourceName: trimmedFundingSourceName,
          fundingSourceCode: trimmedFundingSourceCode || undefined,
        },
      });
      resetForm();
      onClose();
      onCreated();
    } catch (error) {
      console.error('Failed to create funding source.', error);
      setErrorMessage(await resolveErrorMessage(error, 'Failed to create funding source.'));
    } finally {
      setSaving(false);
    }
  };

  const nameRequired = submitted && !fundingSourceName.trim();

  return (
    <ManagementDialog
      errorMessage={errorMessage}
      formId="create-funding-source-form"
      onClose={closeDialog}
      open={open}
      saving={saving}
      submitLabel="Create"
      title="Create Funding Source"
    >
      <Stack component="form" id="create-funding-source-form" spacing={2} onSubmit={createFundingSource} noValidate>
        <TextField
          autoFocus
          disabled={saving}
          error={nameRequired}
          fullWidth
          helperText={nameRequired ? 'Funding source name is required.' : undefined}
          label="Funding source name"
          onChange={(event) => setFundingSourceName(event.target.value)}
          required
          value={fundingSourceName}
        />
        <TextField
          disabled={saving}
          fullWidth
          label="Funding source code"
          onChange={(event) => setFundingSourceCode(event.target.value)}
          value={fundingSourceCode}
        />
      </Stack>
    </ManagementDialog>
  );
};

export default CreateFundingSourceDialog;
