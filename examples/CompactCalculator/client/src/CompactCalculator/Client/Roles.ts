// Roles.ts

export enum Peers {
    Svr = "Svr",
};

export type All = Self | Peers;
export type Self = "Client";

export type PeersToMapped<Value> = {
    [Role in Peers]: Value
};

// Aliases
export const Self: Self = "Client";
export const Server: Peers = Peers.Svr;