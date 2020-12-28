// EFSM.ts

// ======
// States
// ======

export enum SendState {
    S128 = 'S128', S130 = 'S130',
};

export enum ReceiveState {
    S131 = 'S131', S132 = 'S132',
};

export enum TerminalState {
    S129 = 'S129',
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