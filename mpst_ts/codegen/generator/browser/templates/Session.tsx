import { Component } from 'react';
import { State, ReceiveState, SendState, TerminalState } from './EFSM';

export interface IReceive {
  handle(message: any): State
}

export function isReceiveState(state: State): state is ReceiveState {
  return (Object.values(ReceiveState) as Array<State>).includes(state)
}

export function isSendState(state: State): state is SendState {
  return (Object.values(SendState) as Array<State>).includes(state)
}

export function isTerminalState(state: State): state is TerminalState {
  return (Object.values(TerminalState) as Array<State>).includes(state)
}

export type Constructor<T> = new (...args: any[]) => T;
export type EventHandler<Payload> = (event: UIEvent) => Payload;
export type SendComponentFactory<Payload> = (event: string, handler: EventHandler<Payload>) => Constructor<Component>;
export type SendComponentFactoryFactory = <Payload> (label: string, successor: State) => SendComponentFactory<Payload>;
export type ReceiveHandler = (message: any) => State;
