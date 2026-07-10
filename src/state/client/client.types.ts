import type { Client } from "@/api/generated/models/Client";

export const ClientActionType = {
  SET_CLIENTS: "SET_CLIENTS",
  SELECT_CLIENT: "SELECT_CLIENT",
} as const;

export type ClientState = {
  clients: Client[];
  selectedClient: Client | null;
  loading: boolean;
};

export type ClientAction =
  | { type: typeof ClientActionType.SET_CLIENTS; payload: Client[] }
  | { type: typeof ClientActionType.SELECT_CLIENT; payload: Client | null };
