import { ClientActionType } from "@/state/client/client.types";
import type { ClientState, ClientAction } from "@/state/client/client.types";

export const clientReducer = (state: ClientState, action: ClientAction): ClientState => {
  switch (action.type) {
    case ClientActionType.SET_CLIENTS:
      return { ...state, clients: action.payload, loading: false };
    default:
      return state;
  }
};
