// Roles.ts

export enum Peers {
    Server = "Server",
};

export type All = Self | Peers;
export type Self = "Traveller";

export type PeersToMapped<Value> = {
    [Role in Peers]: Value
};

// Aliases
export const Self: Self = "Traveller";
export const Server: Peers = Peers.Server;