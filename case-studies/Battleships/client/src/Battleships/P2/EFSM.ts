// EFSM.ts

// ======
// States
// ======

export enum SendState {
    S220 = 'S220', S223 = 'S223',
};

export enum ReceiveState {
    S222 = 'S222', S224 = 'S224',
};

export enum TerminalState {
    S221 = 'S221',
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