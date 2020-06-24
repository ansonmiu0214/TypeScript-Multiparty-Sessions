// Roles.ts

export enum Peers {
    B = "B", S = "S",
};

export type All = Self | Peers;
export type Self = "A";

export type PeersToMapped<Value> = {
    [Role in Peers]: Value
};

// Aliases
export const Self: Self = "A";
export const Server: Peers = Peers.S;