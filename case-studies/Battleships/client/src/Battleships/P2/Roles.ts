// Roles.ts

export enum Peers {
    Svr = "Svr", P1 = "P1",
};

export type All = Self | Peers;
export type Self = "P2";

export type PeersToMapped<Value> = {
    [Role in Peers]: Value
};

// Aliases
export const Self: Self = "P2";
export const Server: Peers = Peers.Svr;