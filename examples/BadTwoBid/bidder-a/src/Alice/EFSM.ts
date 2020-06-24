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
    S18 = 'S18',
};

export enum ReceiveState {
    S20 = 'S20',
};

export enum TerminalState {
    S19 = 'S19',
};

export type State = ReceiveState | SendState | TerminalState;