// EFSM.ts

// ======
// States
// ======

export enum SendState {
    S107 = 'S107',
};

export enum ReceiveState {
    S109 = 'S109', S110 = 'S110', S111 = 'S111', S112 = 'S112',
};

export enum TerminalState {
    S108 = 'S108',
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