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
    S61 = 'S61',
};

export enum ReceiveState {
    S63 = 'S63', S64 = 'S64', S65 = 'S65', S66 = 'S66',
};

export enum TerminalState {
    S62 = 'S62',
};

export type State = ReceiveState | SendState | TerminalState;