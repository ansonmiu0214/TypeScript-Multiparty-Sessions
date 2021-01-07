// EFSM.ts

// ======
// States
// ======

export enum SendState {
    S109 = 'S109', S112 = 'S112',
};

export enum ReceiveState {
    S113 = 'S113', S111 = 'S111',
};

export enum TerminalState {
    S110 = 'S110',
};

export type State = ReceiveState | SendState | TerminalState;

// ===========
// Type Guards
// ===========

export function isReceiveState(state: State): state is ReceiveState {
    return (Object.values(ReceiveState) as Array<State>).includes(state)
}

export function isSendState(state: State): state is SendState {
    return (Object.values(SendState) as Array<State>).includes(state)
}

export function isTerminalState(state: State): state is TerminalState {
    return (Object.values(TerminalState) as Array<State>).includes(state)
}