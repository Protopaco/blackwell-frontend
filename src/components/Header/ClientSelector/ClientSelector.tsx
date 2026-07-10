import { useNavigate } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { useClient } from "@/state/client/client.context";
import useSelectedClient from "@/state/client/useSelectedClient";
import "@/components/Header/ClientSelector/ClientSelector.css";

const ClientSelector = () => {
  const { state } = useClient();
  const { selectedClient } = useSelectedClient();
  const navigate = useNavigate();

  return (
    <Autocomplete
      id="client-selector"
      options={state.clients}
      loading={state.loading}
      disabled={state.loading}
      value={selectedClient}
      getOptionLabel={(client) => client.clientName ?? ""}
      isOptionEqualToValue={(option, value) => option.clientId === value.clientId}
      onChange={(_event, newValue) => {
        navigate(newValue?.clientId ? `/client/${newValue.clientId}` : "/");
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Client"
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {state.loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
    />
  );
};

export default ClientSelector;
