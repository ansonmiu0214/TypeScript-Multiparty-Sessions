import { Component } from 'react';

export type Constructor<T> = new (...args: any[]) => T;
export type EventHandler<Payload> = (event: UIEvent) => Payload;
export type SendComponentFactory<Payload> = (event: string, handler: EventHandler<Payload>) => Constructor<Component>;
export type ReceiveHandler = (...payload: any[]) => void
export type ReceiveHandlerMap = { [label: string]: ReceiveHandler }
