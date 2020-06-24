// EFSM.ts

// =====
// Roles
// =====

export enum Roles {
    Svr = "Svr",
};

// ======
// States
// ======

export enum SendState {
    S26 = 'S26',
};

export enum ReceiveState {
    S28 = 'S28',
};

export enum TerminalState {
    S27 = 'S27',
};

export type State = ReceiveState | SendState | TerminalState;