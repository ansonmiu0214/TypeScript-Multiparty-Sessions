// EFSM.ts

// ======
// States
// ======

export enum SendState {
    S30 = 'S30', S27 = 'S27',
};

export enum ReceiveState {
    S29 = 'S29',
};

export enum TerminalState {
    S28 = 'S28',
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