// EFSM.ts

// ======
// States
// ======

export enum SendState {
    S31 = 'S31',
};

export enum ReceiveState {
    S33 = 'S33', S34 = 'S34',
};

export enum TerminalState {
    S32 = 'S32',
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