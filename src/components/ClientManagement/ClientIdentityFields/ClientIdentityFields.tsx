import TextField from '@mui/material/TextField';

type Props = {
  clientCode: string;
  clientCodeRequired: boolean;
  clientName: string;
  clientNameRequired: boolean;
  disabled: boolean;
  onClientCodeChange: (value: string) => void;
  onClientNameChange: (value: string) => void;
};

const ClientIdentityFields = ({
  clientCode,
  clientCodeRequired,
  clientName,
  clientNameRequired,
  disabled,
  onClientCodeChange,
  onClientNameChange,
}: Props) => {
  return (
    <>
      <TextField
        autoFocus
        disabled={disabled}
        error={clientNameRequired}
        fullWidth
        helperText={clientNameRequired ? 'Client name is required.' : undefined}
        label="Client name"
        onChange={(event) => onClientNameChange(event.target.value)}
        required
        value={clientName}
      />
      <TextField
        disabled={disabled}
        error={clientCodeRequired}
        fullWidth
        helperText={clientCodeRequired ? 'Client code is required.' : undefined}
        label="Client code"
        onChange={(event) => onClientCodeChange(event.target.value)}
        required
        value={clientCode}
      />
    </>
  );
};

export default ClientIdentityFields;
