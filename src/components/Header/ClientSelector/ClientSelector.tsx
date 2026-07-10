import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { useClient } from "@/state/client/client.context";
import { ClientActionType } from "@/state/client/client.types";
import "@/components/Header/ClientSelector/ClientSelector.css";

const ClientSelector = () => {
  const { state, dispatch } = useClient();

  return (
    <Autocomplete
      id="client-selector"
      options={state.clients}
      loading={state.loading}
      disabled={state.loading}
      value={state.selectedClient}
      getOptionLabel={(client) => client.clientName ?? ""}
      isOptionEqualToValue={(option, value) => option.clientId === value.clientId}
      onChange={(_event, newValue) => {
        dispatch({ type: ClientActionType.SELECT_CLIENT, payload: newValue });
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
