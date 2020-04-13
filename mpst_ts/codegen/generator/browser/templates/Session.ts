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

type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function | undefined ? K : never;
}[keyof T];
type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;

export type DOMEvents = FunctionProperties<React.DOMAttributes<any>>

export type FunctionArguments<T> = T extends (...args: infer R) => infer _ ? R : never;

export type Constructor<T> = new (...args: any[]) => T;
export type EventHandler<Payload, K extends keyof DOMEvents> = (event: FunctionArguments<DOMEvents[K]>) => Payload;
export type SendComponentFactory<Payload> = <K extends keyof DOMEvents> (event: K, handler: EventHandler<Payload, K>) => Constructor<Component>;
export type SendComponentFactoryFactory = <Payload> (label: string, successor: State) => SendComponentFactory<Payload>;
export type ReceiveHandler = (message: any) => State;