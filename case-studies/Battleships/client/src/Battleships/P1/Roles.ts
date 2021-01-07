// Roles.ts

export enum Peers {
    Svr = "Svr", P2 = "P2",
};

export type All = Self | Peers;
export type Self = "P1";

export type PeersToMapped<Value> = {
    [Role in Peers]: Value
};

// Aliases
export const Self: Self = "P1";
export const Server: Peers = Peers.Svr;