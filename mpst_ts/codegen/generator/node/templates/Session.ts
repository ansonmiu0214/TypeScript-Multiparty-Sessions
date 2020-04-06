import { Implementation, State, ReceiveState, TerminalState, SendState } from './EFSM';

export type EfsmNextStateHandler = <S extends State>(state: S) => ((impl: Implementation<S>) => any)
export type MessageHandler = (message: any) => void;

export function isReceiveState(state: State): state is ReceiveState {
  return (Object.values(ReceiveState) as Array<State>).includes(state)
}

export function isSendState(state: State): state is SendState {
  return (Object.values(SendState) as Array<State>).includes(state)
}

export function isTerminalState(state: State): state is TerminalState {
  return (Object.values(TerminalState) as Array<State>).includes(state)
}