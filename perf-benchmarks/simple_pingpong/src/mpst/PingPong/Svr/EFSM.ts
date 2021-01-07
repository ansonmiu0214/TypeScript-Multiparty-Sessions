import {
    FromPromise,
    MaybePromise,
} from "./Utility";

import {
    Cancellation,
} from "./Cancellation";

import {
    StateTransitionHandler,
    SendStateHandler,
    MessageHandler,
    ReceiveStateHandler,
} from "./Runtime";

export namespace Role {
    type Self = "Svr";

    // Constant value for value comparisons
    export const Self: Self = "Svr";

    export enum Peers {
        Client = "Client",
    };

    export type All = Self | Peers;

    export type PeersToMapped<Value> = {
        [Role in Peers]: Value
    };
};

export namespace Message {

    export interface S16_PONG {
        label: "PONG",
        payload: [number],
    };
    export interface S16_BYE {
        label: "BYE",
        payload: [number],
    };

    export type S16 = | S16_PONG | S16_BYE;

    export interface S14_PING {
        label: "PING",
        payload: [number],
    };

    export type S14 = | S14_PING;


    export interface Channel {
        role: Role.All;
        label: string;
        payload: any[];
    };

    export const serialise = <T>(obj: T) => JSON.stringify(obj);
    export const deserialise = <T>(message: any) => JSON.parse(message) as T;

};

export namespace Handler {
    export type S16 =
        MaybePromise<
            | ["PONG", Message.S16_PONG['payload'], State.S14]
            | ["BYE", Message.S16_BYE['payload'], State.S15]

        >;

    export interface S14 {
        "PING": (Next: typeof Factory.S16, ...payload: Message.S14_PING['payload']) => MaybePromise<State.S16>,

    };

};

export namespace State {

    interface ISend {
        readonly type: 'Send';
        performSend(next: StateTransitionHandler, cancel: Cancellation, send: SendStateHandler): void;
    };

    interface IReceive {
        readonly type: 'Receive';
        prepareReceive(next: StateTransitionHandler, cancel: Cancellation, register: ReceiveStateHandler): void;
    };

    interface ITerminal {
        readonly type: 'Terminal';
    };

    export type Type = ISend | IReceive | ITerminal;

    export class S16 implements ISend {
        readonly type: 'Send' = 'Send';
        constructor(public handler: Handler.S16) { }

        performSend(next: StateTransitionHandler, cancel: Cancellation, send: SendStateHandler) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S16>) => {
                send(Role.Peers.Client, label, payload);
                return next(successor);
            };

            if (this.handler instanceof Promise) {
                this.handler.then(thunk).catch(cancel);
            } else {
                try {
                    thunk(this.handler);
                } catch (error) {
                    cancel(error);
                }
            }
        }
    };


    export class S14 implements IReceive {
        readonly type: 'Receive' = 'Receive';
        constructor(public handler: Handler.S14) { }

        prepareReceive(next: StateTransitionHandler, cancel: Cancellation, register: ReceiveStateHandler) {
            const onReceive = (message: any) => {
                const parsed = JSON.parse(message) as Message.S14;
                switch (parsed.label) {
                    case "PING": {
                        try {
                            const successor = this.handler[parsed.label](Factory.S16, ...parsed.payload);
                            if (successor instanceof Promise) {
                                successor.then(next).catch(cancel);
                            } else {
                                next(successor);
                            }
                        } catch (error) {
                            cancel(error);
                        }
                        return;
                    }

                }
            };

            register(Role.Peers.Client, onReceive);
        }
    };



    export class S15 implements ITerminal {
        readonly type: 'Terminal' = 'Terminal';
    };


};

export namespace Factory {


    type S16_PONG =
        | [Message.S16_PONG['payload'], (Next: typeof S14) => State.S14]
        | [Message.S16_PONG['payload'], State.S14]
        ;

    function S16_PONG(
        payload: Message.S16_PONG['payload'],
        generateSuccessor: (Next: typeof S14) => State.S14
    ): State.S16;
    function S16_PONG(
        payload: Message.S16_PONG['payload'],
        succ: State.S14
    ): State.S16;
    function S16_PONG(...args: S16_PONG) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S14);
            return new State.S16(["PONG", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S16(["PONG", payload, successor]);
        }
    }

    type S16_BYE =
        | [Message.S16_BYE['payload'], (Next: typeof S15) => State.S15]
        | [Message.S16_BYE['payload'], State.S15]
        ;

    function S16_BYE(
        payload: Message.S16_BYE['payload'],
        generateSuccessor: (Next: typeof S15) => State.S15
    ): State.S16;
    function S16_BYE(
        payload: Message.S16_BYE['payload'],
        succ: State.S15
    ): State.S16;
    function S16_BYE(...args: S16_BYE) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S15);
            return new State.S16(["BYE", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S16(["BYE", payload, successor]);
        }
    }


    export const S16 = {
        PONG: S16_PONG,
        BYE: S16_BYE,

    };

    export function S14(handler: Handler.S14) {
        return new State.S14(handler);
    };


    export const Initial = S14;

    export const S15 = () => new State.S15();
    export const Terminal = S15;

};