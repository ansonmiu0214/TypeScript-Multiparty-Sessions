import { Credentials as Cred } from "../../Models";
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
    type Self = "S";

    // Constant value for value comparisons
    export const Self: Self = "S";

    export enum Peers {
        B = "B", A = "A",
    };

    export type All = Self | Peers;

    export type PeersToMapped<Value> = {
        [Role in Peers]: Value
    };
};

export namespace Message {

    export interface S40_Full {
        label: "Full",
        payload: [],
    };
    export interface S40_Available {
        label: "Available",
        payload: [number],
    };

    export type S40 = | S40_Full | S40_Available;

    export interface S38_Query {
        label: "Query",
        payload: [string],
    };

    export type S38 = | S38_Query;

    export interface S41_Confirm {
        label: "Confirm",
        payload: [Cred],
    };
    export interface S41_Reject {
        label: "Reject",
        payload: [],
    };

    export type S41 = | S41_Confirm | S41_Reject;


    export interface Channel {
        role: Role.All;
        label: string;
        payload: any[];
    };

    export const serialise = <T>(obj: T) => JSON.stringify(obj);
    export const deserialise = <T>(message: any) => JSON.parse(message) as T;

};

export namespace Handler {
    export type S40 =
        MaybePromise<
            | ["Full", Message.S40_Full['payload'], State.S38]
            | ["Available", Message.S40_Available['payload'], State.S41]

        >;

    export interface S38 {
        "Query": (Next: typeof Factory.S40, ...payload: Message.S38_Query['payload']) => MaybePromise<State.S40>,

    };
    export interface S41 {
        "Confirm": (Next: typeof Factory.S39, ...payload: Message.S41_Confirm['payload']) => MaybePromise<State.S39>,
        "Reject": (Next: typeof Factory.S39, ...payload: Message.S41_Reject['payload']) => MaybePromise<State.S39>,

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

    export class S40 implements ISend {
        readonly type: 'Send' = 'Send';
        constructor(public handler: Handler.S40) { }

        performSend(next: StateTransitionHandler, cancel: Cancellation, send: SendStateHandler) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S40>) => {
                send(Role.Peers.A, label, payload);
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


    export class S38 implements IReceive {
        readonly type: 'Receive' = 'Receive';
        constructor(public handler: Handler.S38) { }

        prepareReceive(next: StateTransitionHandler, cancel: Cancellation, register: ReceiveStateHandler) {
            const onReceive = (message: any) => {
                const parsed = JSON.parse(message) as Message.S38;
                switch (parsed.label) {
                    case "Query": {
                        try {
                            const successor = this.handler[parsed.label](Factory.S40, ...parsed.payload);
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

            register(Role.Peers.A, onReceive);
        }
    };
    export class S41 implements IReceive {
        readonly type: 'Receive' = 'Receive';
        constructor(public handler: Handler.S41) { }

        prepareReceive(next: StateTransitionHandler, cancel: Cancellation, register: ReceiveStateHandler) {
            const onReceive = (message: any) => {
                const parsed = JSON.parse(message) as Message.S41;
                switch (parsed.label) {
                    case "Confirm": {
                        try {
                            const successor = this.handler[parsed.label](Factory.S39, ...parsed.payload);
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
                    case "Reject": {
                        try {
                            const successor = this.handler[parsed.label](Factory.S39, ...parsed.payload);
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

            register(Role.Peers.A, onReceive);
        }
    };



    export class S39 implements ITerminal {
        readonly type: 'Terminal' = 'Terminal';
    };


};

export namespace Factory {


    type S40_Full =
        | [Message.S40_Full['payload'], (Next: typeof S38) => State.S38]
        | [Message.S40_Full['payload'], State.S38]
        ;

    function S40_Full(
        payload: Message.S40_Full['payload'],
        generateSuccessor: (Next: typeof S38) => State.S38
    ): State.S40;
    function S40_Full(
        payload: Message.S40_Full['payload'],
        succ: State.S38
    ): State.S40;
    function S40_Full(...args: S40_Full) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S38);
            return new State.S40(["Full", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S40(["Full", payload, successor]);
        }
    }

    type S40_Available =
        | [Message.S40_Available['payload'], (Next: typeof S41) => State.S41]
        | [Message.S40_Available['payload'], State.S41]
        ;

    function S40_Available(
        payload: Message.S40_Available['payload'],
        generateSuccessor: (Next: typeof S41) => State.S41
    ): State.S40;
    function S40_Available(
        payload: Message.S40_Available['payload'],
        succ: State.S41
    ): State.S40;
    function S40_Available(...args: S40_Available) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S41);
            return new State.S40(["Available", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S40(["Available", payload, successor]);
        }
    }


    export const S40 = {
        Full: S40_Full,
        Available: S40_Available,

    };

    export function S38(handler: Handler.S38) {
        return new State.S38(handler);
    };
    export function S41(handler: Handler.S41) {
        return new State.S41(handler);
    };


    export const Initial = S38;

    export const S39 = () => new State.S39();
    export const Terminal = S39;

};