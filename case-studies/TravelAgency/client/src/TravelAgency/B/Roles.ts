// Roles.ts

export enum Peers {
    A = "A", S = "S",
};

export type All = Self | Peers;
export type Self = "B";

export type PeersToMapped<Value> = {
    [Role in Peers]: Value
};

// Aliases
export const Self: Self = "B";
export const Server: Peers = Peers.S;