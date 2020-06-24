// EFSM.ts

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