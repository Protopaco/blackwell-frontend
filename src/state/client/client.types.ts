import type { Client } from "@/api/generated/models/Client";

export const ClientActionType = {
  SET_CLIENTS: "SET_CLIENTS",
} as const;

export type ClientState = {
  clients: Client[];
  loading: boolean;
};

export type ClientAction = { type: typeof ClientActionType.SET_CLIENTS; payload: Client[] };
