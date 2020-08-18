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

export namespace Label {
    export enum S92 {
        Res = "Res",
    };
    export enum S93 {
        Res = "Res",
    };
    export enum S94 {
        Res = "Res",
    };
    export enum S95 {
        Terminate = "Terminate",
    };
    export enum S90 {
        Add = "Add", Mult = "Mult", Double = "Double", Quit = "Quit",
    };

};

export namespace Message {

    export interface S92_Res {
        label: Label.S92.Res,
        payload: [number],
    };

    export type S92 = | S92_Res;

    export interface S93_Res {
        label: Label.S93.Res,
        payload: [number],
    };

    export type S93 = | S93_Res;

    export interface S94_Res {
        label: Label.S94.Res,
        payload: [number],
    };

    export type S94 = | S94_Res;

    export interface S95_Terminate {
        label: Label.S95.Terminate,
        payload: [],
    };

    export type S95 = | S95_Terminate;

    export interface S90_Add {
        label: Label.S90.Add,
        payload: [number, number],
    };
    export interface S90_Mult {
        label: Label.S90.Mult,
        payload: [number, number],
    };
    export interface S90_Double {
        label: Label.S90.Double,
        payload: [number],
    };
    export interface S90_Quit {
        label: Label.S90.Quit,
        payload: [],
    };

    export type S90 = | S90_Add | S90_Mult | S90_Double | S90_Quit;


    export interface Channel {
        role: Role.All;
        label: string;
        payload: any[];
    };

    export const serialise = <T>(obj: T) => JSON.stringify(obj);
    export const deserialise = <T>(message: any) => JSON.parse(message) as T;

};

export namespace Handler {
    export type S92 =
        MaybePromise<
            | [Label.S92.Res, Message.S92_Res['payload'], State.S90]

        >;
    export type S93 =
        MaybePromise<
            | [Label.S93.Res, Message.S93_Res['payload'], State.S90]

        >;
    export type S94 =
        MaybePromise<
            | [Label.S94.Res, Message.S94_Res['payload'], State.S90]

        >;
    export type S95 =
        MaybePromise<
            | [Label.S95.Terminate, Message.S95_Terminate['payload'], State.S91]

        >;

    export interface S90 {
        [Label.S90.Add]: (Next: typeof Factory.S92, ...payload: Message.S90_Add['payload']) => MaybePromise<State.S92>,
        [Label.S90.Mult]: (Next: typeof Factory.S93, ...payload: Message.S90_Mult['payload']) => MaybePromise<State.S93>,
        [Label.S90.Double]: (Next: typeof Factory.S94, ...payload: Message.S90_Double['payload']) => MaybePromise<State.S94>,
        [Label.S90.Quit]: (Next: typeof Factory.S95, ...payload: Message.S90_Quit['payload']) => MaybePromise<State.S95>,

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

    export class S92 implements ISend {
        readonly type: 'Send' = 'Send';
        constructor(private handler: Handler.S92) { }

        performSend(next: StateTransitionHandler, cancel: Cancellation, send: SendStateHandler) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S92>) => {
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
    export class S93 implements ISend {
        readonly type: 'Send' = 'Send';
        constructor(private handler: Handler.S93) { }

        performSend(next: StateTransitionHandler, cancel: Cancellation, send: SendStateHandler) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S93>) => {
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
    export class S94 implements ISend {
        readonly type: 'Send' = 'Send';
        constructor(private handler: Handler.S94) { }

        performSend(next: StateTransitionHandler, cancel: Cancellation, send: SendStateHandler) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S94>) => {
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
    export class S95 implements ISend {
        readonly type: 'Send' = 'Send';
        constructor(private handler: Handler.S95) { }

        performSend(next: StateTransitionHandler, cancel: Cancellation, send: SendStateHandler) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S95>) => {
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


    export class S90 implements IReceive {
        readonly type: 'Receive' = 'Receive';
        constructor(private handler: Handler.S90) { }

        prepareReceive(next: StateTransitionHandler, cancel: Cancellation, register: ReceiveStateHandler) {
            const onReceive = (message: any) => {
                const parsed = JSON.parse(message) as Message.S90;
                switch (parsed.label) {
                    case Label.S90.Add: {
                        try {
                            const successor = this.handler[parsed.label](Factory.S92, ...parsed.payload);
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
                    case Label.S90.Mult: {
                        try {
                            const successor = this.handler[parsed.label](Factory.S93, ...parsed.payload);
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
                    case Label.S90.Double: {
                        try {
                            const successor = this.handler[parsed.label](Factory.S94, ...parsed.payload);
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
                    case Label.S90.Quit: {
                        try {
                            const successor = this.handler[parsed.label](Factory.S95, ...parsed.payload);
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



    export class S91 implements ITerminal {
        readonly type: 'Terminal' = 'Terminal';
    };


};

export namespace Factory {


    type S92_Res =
        | [Message.S92_Res['payload'], (Next: typeof S90) => State.S90]
        | [Message.S92_Res['payload'], State.S90]
        ;

    function S92_Res(
        payload: Message.S92_Res['payload'],
        generateSuccessor: (Next: typeof S90) => State.S90
    ): State.S92;
    function S92_Res(
        payload: Message.S92_Res['payload'],
        succ: State.S90
    ): State.S92;
    function S92_Res(...args: S92_Res) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S90);
            return new State.S92([Label.S92.Res, payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S92([Label.S92.Res, payload, successor]);
        }
    }


    export const S92 = {
        Res: S92_Res,

    };
    type S93_Res =
        | [Message.S93_Res['payload'], (Next: typeof S90) => State.S90]
        | [Message.S93_Res['payload'], State.S90]
        ;

    function S93_Res(
        payload: Message.S93_Res['payload'],
        generateSuccessor: (Next: typeof S90) => State.S90
    ): State.S93;
    function S93_Res(
        payload: Message.S93_Res['payload'],
        succ: State.S90
    ): State.S93;
    function S93_Res(...args: S93_Res) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S90);
            return new State.S93([Label.S93.Res, payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S93([Label.S93.Res, payload, successor]);
        }
    }


    export const S93 = {
        Res: S93_Res,

    };
    type S94_Res =
        | [Message.S94_Res['payload'], (Next: typeof S90) => State.S90]
        | [Message.S94_Res['payload'], State.S90]
        ;

    function S94_Res(
        payload: Message.S94_Res['payload'],
        generateSuccessor: (Next: typeof S90) => State.S90
    ): State.S94;
    function S94_Res(
        payload: Message.S94_Res['payload'],
        succ: State.S90
    ): State.S94;
    function S94_Res(...args: S94_Res) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S90);
            return new State.S94([Label.S94.Res, payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S94([Label.S94.Res, payload, successor]);
        }
    }


    export const S94 = {
        Res: S94_Res,

    };
    type S95_Terminate =
        | [Message.S95_Terminate['payload'], (Next: typeof S91) => State.S91]
        | [Message.S95_Terminate['payload'], State.S91]
        ;

    function S95_Terminate(
        payload: Message.S95_Terminate['payload'],
        generateSuccessor: (Next: typeof S91) => State.S91
    ): State.S95;
    function S95_Terminate(
        payload: Message.S95_Terminate['payload'],
        succ: State.S91
    ): State.S95;
    function S95_Terminate(...args: S95_Terminate) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S91);
            return new State.S95([Label.S95.Terminate, payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S95([Label.S95.Terminate, payload, successor]);
        }
    }


    export const S95 = {
        Terminate: S95_Terminate,

    };

    export function S90(handler: Handler.S90) {
        return new State.S90(handler);
    }

    export const Initial = S90;

    export const S91 = () => new State.S91();
    export const Terminal = S91;


};