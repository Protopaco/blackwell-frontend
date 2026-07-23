import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { fundingSourceApi } from '@/api/client';
import type { FundingSource } from '@/api/generated/models/FundingSource';
import ManagementDialog from '@/components/Shared/ManagementDialog/ManagementDialog';
import { useToast } from '@/state/toast/toast.context';
import resolveErrorMessage from '@/utils/resolveErrorMessage';

type Props = {
  clientId: string;
  fundingSource: FundingSource | null;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
};

const EditFundingSourceDialog = ({ clientId, fundingSource, open, onClose, onSaved }: Props) => {
  const [fundingSourceName, setFundingSourceName] = useState('');
  const [fundingSourceCode, setFundingSourceCode] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (!open || !fundingSource) return;

    setFundingSourceName(fundingSource.fundingSourceName ?? '');
    setFundingSourceCode(fundingSource.fundingSourceCode ?? '');
    setSubmitted(false);
    setErrorMessage(null);
  }, [fundingSource, open]);

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

  const saveFundingSource = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving || !fundingSource?.fundingSourceId) return;

    setSubmitted(true);
    setErrorMessage(null);

    const trimmedFundingSourceName = fundingSourceName.trim();
    const trimmedFundingSourceCode = fundingSourceCode.trim();

    if (!trimmedFundingSourceName) return;

    setSaving(true);

    try {
      await fundingSourceApi.v1UpdateFundingSource({
        clientId,
        fundingSourceId: fundingSource.fundingSourceId,
        fundingSource: {
          fundingSourceName: trimmedFundingSourceName,
          fundingSourceCode: trimmedFundingSourceCode || undefined,
        },
      });
      resetForm();
      onClose();
      onSaved();
      showToast('Funding source updated.', 'success');
    } catch (error) {
      console.error('Failed to update funding source.', error);
      const message = await resolveErrorMessage(error, 'Failed to update funding source.');
      setErrorMessage(message);
      showToast(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const nameRequired = submitted && !fundingSourceName.trim();

  return (
    <ManagementDialog
      errorMessage={errorMessage}
      formId="edit-funding-source-form"
      onClose={closeDialog}
      open={open}
      saving={saving}
      submitLabel="Save"
      title="Edit Funding Source"
    >
      <Stack component="form" id="edit-funding-source-form" spacing={2} onSubmit={saveFundingSource} noValidate>
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

export default EditFundingSourceDialog;
