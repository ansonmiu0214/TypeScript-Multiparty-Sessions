// EFSM.ts

// ======
// States
// ======

export enum SendState {
    S44 = 'S44',
};

export enum ReceiveState {
    S42 = 'S42', S45 = 'S45',
};

export enum TerminalState {
    S43 = 'S43',
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