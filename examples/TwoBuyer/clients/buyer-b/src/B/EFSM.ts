// EFSM.ts

// ======
// States
// ======

export enum SendState {
    S19 = 'S19',
};

export enum ReceiveState {
    S16 = 'S16', S20 = 'S20', S18 = 'S18',
};

export enum TerminalState {
    S17 = 'S17',
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