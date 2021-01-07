import { Config } from "../../Models";
import { Location } from "../../Models";
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
        P1 = "P1", P2 = "P2",
    };

    export type All = Self | Peers;

    export type PeersToMapped<Value> = {
        [Role in Peers]: Value
    };
};

export namespace Message {

    export interface S69_Hit {
        label: "Hit",
        payload: [Location],
    };
    export interface S69_Miss {
        label: "Miss",
        payload: [Location],
    };
    export interface S69_Sunk {
        label: "Sunk",
        payload: [Location],
    };
    export interface S69_Winner {
        label: "Winner",
        payload: [Location],
    };

    export type S69 = | S69_Hit | S69_Miss | S69_Sunk | S69_Winner;

    export interface S70_Hit {
        label: "Hit",
        payload: [Location],
    };

    export type S70 = | S70_Hit;

    export interface S73_Loser {
        label: "Loser",
        payload: [Location],
    };

    export type S73 = | S73_Loser;

    export interface S74_Miss {
        label: "Miss",
        payload: [Location],
    };

    export type S74 = | S74_Miss;

    export interface S66_Hit {
        label: "Hit",
        payload: [Location],
    };
    export interface S66_Miss {
        label: "Miss",
        payload: [Location],
    };
    export interface S66_Sunk {
        label: "Sunk",
        payload: [Location],
    };
    export interface S66_Winner {
        label: "Winner",
        payload: [Location],
    };

    export type S66 = | S66_Hit | S66_Miss | S66_Sunk | S66_Winner;

    export interface S72_Sunk {
        label: "Sunk",
        payload: [Location],
    };

    export type S72 = | S72_Sunk;

    export interface S88_Loser {
        label: "Loser",
        payload: [Location],
    };

    export type S88 = | S88_Loser;

    export interface S67_Hit {
        label: "Hit",
        payload: [Location],
    };

    export type S67 = | S67_Hit;

    export interface S81_Sunk {
        label: "Sunk",
        payload: [Location],
    };

    export type S81 = | S81_Sunk;

    export interface S71_Miss {
        label: "Miss",
        payload: [Location],
    };

    export type S71 = | S71_Miss;

    export interface S64_Init {
        label: "Init",
        payload: [Config],
    };

    export type S64 = | S64_Init;

    export interface S62_Init {
        label: "Init",
        payload: [Config],
    };

    export type S62 = | S62_Init;

    export interface S68_Attack {
        label: "Attack",
        payload: [Location],
    };

    export type S68 = | S68_Attack;

    export interface S65_Attack {
        label: "Attack",
        payload: [Location],
    };

    export type S65 = | S65_Attack;


    export interface Channel {
        role: Role.All;
        label: string;
        payload: any[];
    };

    export const serialise = <T>(obj: T) => JSON.stringify(obj);
    export const deserialise = <T>(message: any) => JSON.parse(message) as T;

};

export namespace Handler {
    export type S69 =
        MaybePromise<
            | ["Hit", Message.S69_Hit['payload'], State.S70]
            | ["Miss", Message.S69_Miss['payload'], State.S71]
            | ["Sunk", Message.S69_Sunk['payload'], State.S72]
            | ["Winner", Message.S69_Winner['payload'], State.S73]

        >;
    export type S70 =
        MaybePromise<
            | ["Hit", Message.S70_Hit['payload'], State.S65]

        >;
    export type S73 =
        MaybePromise<
            | ["Loser", Message.S73_Loser['payload'], State.S63]

        >;
    export type S74 =
        MaybePromise<
            | ["Miss", Message.S74_Miss['payload'], State.S68]

        >;
    export type S66 =
        MaybePromise<
            | ["Hit", Message.S66_Hit['payload'], State.S67]
            | ["Miss", Message.S66_Miss['payload'], State.S74]
            | ["Sunk", Message.S66_Sunk['payload'], State.S81]
            | ["Winner", Message.S66_Winner['payload'], State.S88]

        >;
    export type S72 =
        MaybePromise<
            | ["Sunk", Message.S72_Sunk['payload'], State.S65]

        >;
    export type S88 =
        MaybePromise<
            | ["Loser", Message.S88_Loser['payload'], State.S63]

        >;
    export type S67 =
        MaybePromise<
            | ["Hit", Message.S67_Hit['payload'], State.S68]

        >;
    export type S81 =
        MaybePromise<
            | ["Sunk", Message.S81_Sunk['payload'], State.S68]

        >;
    export type S71 =
        MaybePromise<
            | ["Miss", Message.S71_Miss['payload'], State.S65]

        >;

    export interface S64 {
        "Init": (Next: typeof Factory.S65, ...payload: Message.S64_Init['payload']) => MaybePromise<State.S65>,

    };
    export interface S62 {
        "Init": (Next: typeof Factory.S64, ...payload: Message.S62_Init['payload']) => MaybePromise<State.S64>,

    };
    export interface S68 {
        "Attack": (Next: typeof Factory.S69, ...payload: Message.S68_Attack['payload']) => MaybePromise<State.S69>,

    };
    export interface S65 {
        "Attack": (Next: typeof Factory.S66, ...payload: Message.S65_Attack['payload']) => MaybePromise<State.S66>,

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

    export class S69 implements ISend {
        readonly type: 'Send' = 'Send';
        constructor(public handler: Handler.S69) { }

        performSend(next: StateTransitionHandler, cancel: Cancellation, send: SendStateHandler) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S69>) => {
                send(Role.Peers.P2, label, payload);
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
    export class S70 implements ISend {
        readonly type: 'Send' = 'Send';
        constructor(public handler: Handler.S70) { }

        performSend(next: StateTransitionHandler, cancel: Cancellation, send: SendStateHandler) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S70>) => {
                send(Role.Peers.P1, label, payload);
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
    export class S73 implements ISend {
        readonly type: 'Send' = 'Send';
        constructor(public handler: Handler.S73) { }

        performSend(next: StateTransitionHandler, cancel: Cancellation, send: SendStateHandler) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S73>) => {
                send(Role.Peers.P1, label, payload);
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
    export class S74 implements ISend {
        readonly type: 'Send' = 'Send';
        constructor(public handler: Handler.S74) { }

        performSend(next: StateTransitionHandler, cancel: Cancellation, send: SendStateHandler) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S74>) => {
                send(Role.Peers.P2, label, payload);
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
    export class S66 implements ISend {
        readonly type: 'Send' = 'Send';
        constructor(public handler: Handler.S66) { }

        performSend(next: StateTransitionHandler, cancel: Cancellation, send: SendStateHandler) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S66>) => {
                send(Role.Peers.P1, label, payload);
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
    export class S72 implements ISend {
        readonly type: 'Send' = 'Send';
        constructor(public handler: Handler.S72) { }

        performSend(next: StateTransitionHandler, cancel: Cancellation, send: SendStateHandler) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S72>) => {
                send(Role.Peers.P1, label, payload);
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
    export class S88 implements ISend {
        readonly type: 'Send' = 'Send';
        constructor(public handler: Handler.S88) { }

        performSend(next: StateTransitionHandler, cancel: Cancellation, send: SendStateHandler) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S88>) => {
                send(Role.Peers.P2, label, payload);
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
    export class S67 implements ISend {
        readonly type: 'Send' = 'Send';
        constructor(public handler: Handler.S67) { }

        performSend(next: StateTransitionHandler, cancel: Cancellation, send: SendStateHandler) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S67>) => {
                send(Role.Peers.P2, label, payload);
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
    export class S81 implements ISend {
        readonly type: 'Send' = 'Send';
        constructor(public handler: Handler.S81) { }

        performSend(next: StateTransitionHandler, cancel: Cancellation, send: SendStateHandler) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S81>) => {
                send(Role.Peers.P2, label, payload);
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
    export class S71 implements ISend {
        readonly type: 'Send' = 'Send';
        constructor(public handler: Handler.S71) { }

        performSend(next: StateTransitionHandler, cancel: Cancellation, send: SendStateHandler) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S71>) => {
                send(Role.Peers.P1, label, payload);
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


    export class S64 implements IReceive {
        readonly type: 'Receive' = 'Receive';
        constructor(public handler: Handler.S64) { }

        prepareReceive(next: StateTransitionHandler, cancel: Cancellation, register: ReceiveStateHandler) {
            const onReceive = (message: any) => {
                const parsed = JSON.parse(message) as Message.S64;
                switch (parsed.label) {
                    case "Init": {
                        try {
                            const successor = this.handler[parsed.label](Factory.S65, ...parsed.payload);
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

            register(Role.Peers.P2, onReceive);
        }
    };
    export class S62 implements IReceive {
        readonly type: 'Receive' = 'Receive';
        constructor(public handler: Handler.S62) { }

        prepareReceive(next: StateTransitionHandler, cancel: Cancellation, register: ReceiveStateHandler) {
            const onReceive = (message: any) => {
                const parsed = JSON.parse(message) as Message.S62;
                switch (parsed.label) {
                    case "Init": {
                        try {
                            const successor = this.handler[parsed.label](Factory.S64, ...parsed.payload);
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

            register(Role.Peers.P1, onReceive);
        }
    };
    export class S68 implements IReceive {
        readonly type: 'Receive' = 'Receive';
        constructor(public handler: Handler.S68) { }

        prepareReceive(next: StateTransitionHandler, cancel: Cancellation, register: ReceiveStateHandler) {
            const onReceive = (message: any) => {
                const parsed = JSON.parse(message) as Message.S68;
                switch (parsed.label) {
                    case "Attack": {
                        try {
                            const successor = this.handler[parsed.label](Factory.S69, ...parsed.payload);
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

            register(Role.Peers.P2, onReceive);
        }
    };
    export class S65 implements IReceive {
        readonly type: 'Receive' = 'Receive';
        constructor(public handler: Handler.S65) { }

        prepareReceive(next: StateTransitionHandler, cancel: Cancellation, register: ReceiveStateHandler) {
            const onReceive = (message: any) => {
                const parsed = JSON.parse(message) as Message.S65;
                switch (parsed.label) {
                    case "Attack": {
                        try {
                            const successor = this.handler[parsed.label](Factory.S66, ...parsed.payload);
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

            register(Role.Peers.P1, onReceive);
        }
    };



    export class S63 implements ITerminal {
        readonly type: 'Terminal' = 'Terminal';
    };


};

export namespace Factory {


    type S69_Hit =
        | [Message.S69_Hit['payload'], (Next: typeof S70) => State.S70]
        | [Message.S69_Hit['payload'], State.S70]
        ;

    function S69_Hit(
        payload: Message.S69_Hit['payload'],
        generateSuccessor: (Next: typeof S70) => State.S70
    ): State.S69;
    function S69_Hit(
        payload: Message.S69_Hit['payload'],
        succ: State.S70
    ): State.S69;
    function S69_Hit(...args: S69_Hit) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S70);
            return new State.S69(["Hit", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S69(["Hit", payload, successor]);
        }
    }

    type S69_Miss =
        | [Message.S69_Miss['payload'], (Next: typeof S71) => State.S71]
        | [Message.S69_Miss['payload'], State.S71]
        ;

    function S69_Miss(
        payload: Message.S69_Miss['payload'],
        generateSuccessor: (Next: typeof S71) => State.S71
    ): State.S69;
    function S69_Miss(
        payload: Message.S69_Miss['payload'],
        succ: State.S71
    ): State.S69;
    function S69_Miss(...args: S69_Miss) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S71);
            return new State.S69(["Miss", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S69(["Miss", payload, successor]);
        }
    }

    type S69_Sunk =
        | [Message.S69_Sunk['payload'], (Next: typeof S72) => State.S72]
        | [Message.S69_Sunk['payload'], State.S72]
        ;

    function S69_Sunk(
        payload: Message.S69_Sunk['payload'],
        generateSuccessor: (Next: typeof S72) => State.S72
    ): State.S69;
    function S69_Sunk(
        payload: Message.S69_Sunk['payload'],
        succ: State.S72
    ): State.S69;
    function S69_Sunk(...args: S69_Sunk) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S72);
            return new State.S69(["Sunk", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S69(["Sunk", payload, successor]);
        }
    }

    type S69_Winner =
        | [Message.S69_Winner['payload'], (Next: typeof S73) => State.S73]
        | [Message.S69_Winner['payload'], State.S73]
        ;

    function S69_Winner(
        payload: Message.S69_Winner['payload'],
        generateSuccessor: (Next: typeof S73) => State.S73
    ): State.S69;
    function S69_Winner(
        payload: Message.S69_Winner['payload'],
        succ: State.S73
    ): State.S69;
    function S69_Winner(...args: S69_Winner) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S73);
            return new State.S69(["Winner", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S69(["Winner", payload, successor]);
        }
    }


    export const S69 = {
        Hit: S69_Hit,
        Miss: S69_Miss,
        Sunk: S69_Sunk,
        Winner: S69_Winner,

    };
    type S70_Hit =
        | [Message.S70_Hit['payload'], (Next: typeof S65) => State.S65]
        | [Message.S70_Hit['payload'], State.S65]
        ;

    function S70_Hit(
        payload: Message.S70_Hit['payload'],
        generateSuccessor: (Next: typeof S65) => State.S65
    ): State.S70;
    function S70_Hit(
        payload: Message.S70_Hit['payload'],
        succ: State.S65
    ): State.S70;
    function S70_Hit(...args: S70_Hit) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S65);
            return new State.S70(["Hit", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S70(["Hit", payload, successor]);
        }
    }


    export const S70 = {
        Hit: S70_Hit,

    };
    type S73_Loser =
        | [Message.S73_Loser['payload'], (Next: typeof S63) => State.S63]
        | [Message.S73_Loser['payload'], State.S63]
        ;

    function S73_Loser(
        payload: Message.S73_Loser['payload'],
        generateSuccessor: (Next: typeof S63) => State.S63
    ): State.S73;
    function S73_Loser(
        payload: Message.S73_Loser['payload'],
        succ: State.S63
    ): State.S73;
    function S73_Loser(...args: S73_Loser) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S63);
            return new State.S73(["Loser", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S73(["Loser", payload, successor]);
        }
    }


    export const S73 = {
        Loser: S73_Loser,

    };
    type S74_Miss =
        | [Message.S74_Miss['payload'], (Next: typeof S68) => State.S68]
        | [Message.S74_Miss['payload'], State.S68]
        ;

    function S74_Miss(
        payload: Message.S74_Miss['payload'],
        generateSuccessor: (Next: typeof S68) => State.S68
    ): State.S74;
    function S74_Miss(
        payload: Message.S74_Miss['payload'],
        succ: State.S68
    ): State.S74;
    function S74_Miss(...args: S74_Miss) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S68);
            return new State.S74(["Miss", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S74(["Miss", payload, successor]);
        }
    }


    export const S74 = {
        Miss: S74_Miss,

    };
    type S66_Hit =
        | [Message.S66_Hit['payload'], (Next: typeof S67) => State.S67]
        | [Message.S66_Hit['payload'], State.S67]
        ;

    function S66_Hit(
        payload: Message.S66_Hit['payload'],
        generateSuccessor: (Next: typeof S67) => State.S67
    ): State.S66;
    function S66_Hit(
        payload: Message.S66_Hit['payload'],
        succ: State.S67
    ): State.S66;
    function S66_Hit(...args: S66_Hit) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S67);
            return new State.S66(["Hit", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S66(["Hit", payload, successor]);
        }
    }

    type S66_Miss =
        | [Message.S66_Miss['payload'], (Next: typeof S74) => State.S74]
        | [Message.S66_Miss['payload'], State.S74]
        ;

    function S66_Miss(
        payload: Message.S66_Miss['payload'],
        generateSuccessor: (Next: typeof S74) => State.S74
    ): State.S66;
    function S66_Miss(
        payload: Message.S66_Miss['payload'],
        succ: State.S74
    ): State.S66;
    function S66_Miss(...args: S66_Miss) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S74);
            return new State.S66(["Miss", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S66(["Miss", payload, successor]);
        }
    }

    type S66_Sunk =
        | [Message.S66_Sunk['payload'], (Next: typeof S81) => State.S81]
        | [Message.S66_Sunk['payload'], State.S81]
        ;

    function S66_Sunk(
        payload: Message.S66_Sunk['payload'],
        generateSuccessor: (Next: typeof S81) => State.S81
    ): State.S66;
    function S66_Sunk(
        payload: Message.S66_Sunk['payload'],
        succ: State.S81
    ): State.S66;
    function S66_Sunk(...args: S66_Sunk) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S81);
            return new State.S66(["Sunk", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S66(["Sunk", payload, successor]);
        }
    }

    type S66_Winner =
        | [Message.S66_Winner['payload'], (Next: typeof S88) => State.S88]
        | [Message.S66_Winner['payload'], State.S88]
        ;

    function S66_Winner(
        payload: Message.S66_Winner['payload'],
        generateSuccessor: (Next: typeof S88) => State.S88
    ): State.S66;
    function S66_Winner(
        payload: Message.S66_Winner['payload'],
        succ: State.S88
    ): State.S66;
    function S66_Winner(...args: S66_Winner) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S88);
            return new State.S66(["Winner", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S66(["Winner", payload, successor]);
        }
    }


    export const S66 = {
        Hit: S66_Hit,
        Miss: S66_Miss,
        Sunk: S66_Sunk,
        Winner: S66_Winner,

    };
    type S72_Sunk =
        | [Message.S72_Sunk['payload'], (Next: typeof S65) => State.S65]
        | [Message.S72_Sunk['payload'], State.S65]
        ;

    function S72_Sunk(
        payload: Message.S72_Sunk['payload'],
        generateSuccessor: (Next: typeof S65) => State.S65
    ): State.S72;
    function S72_Sunk(
        payload: Message.S72_Sunk['payload'],
        succ: State.S65
    ): State.S72;
    function S72_Sunk(...args: S72_Sunk) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S65);
            return new State.S72(["Sunk", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S72(["Sunk", payload, successor]);
        }
    }


    export const S72 = {
        Sunk: S72_Sunk,

    };
    type S88_Loser =
        | [Message.S88_Loser['payload'], (Next: typeof S63) => State.S63]
        | [Message.S88_Loser['payload'], State.S63]
        ;

    function S88_Loser(
        payload: Message.S88_Loser['payload'],
        generateSuccessor: (Next: typeof S63) => State.S63
    ): State.S88;
    function S88_Loser(
        payload: Message.S88_Loser['payload'],
        succ: State.S63
    ): State.S88;
    function S88_Loser(...args: S88_Loser) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S63);
            return new State.S88(["Loser", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S88(["Loser", payload, successor]);
        }
    }


    export const S88 = {
        Loser: S88_Loser,

    };
    type S67_Hit =
        | [Message.S67_Hit['payload'], (Next: typeof S68) => State.S68]
        | [Message.S67_Hit['payload'], State.S68]
        ;

    function S67_Hit(
        payload: Message.S67_Hit['payload'],
        generateSuccessor: (Next: typeof S68) => State.S68
    ): State.S67;
    function S67_Hit(
        payload: Message.S67_Hit['payload'],
        succ: State.S68
    ): State.S67;
    function S67_Hit(...args: S67_Hit) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S68);
            return new State.S67(["Hit", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S67(["Hit", payload, successor]);
        }
    }


    export const S67 = {
        Hit: S67_Hit,

    };
    type S81_Sunk =
        | [Message.S81_Sunk['payload'], (Next: typeof S68) => State.S68]
        | [Message.S81_Sunk['payload'], State.S68]
        ;

    function S81_Sunk(
        payload: Message.S81_Sunk['payload'],
        generateSuccessor: (Next: typeof S68) => State.S68
    ): State.S81;
    function S81_Sunk(
        payload: Message.S81_Sunk['payload'],
        succ: State.S68
    ): State.S81;
    function S81_Sunk(...args: S81_Sunk) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S68);
            return new State.S81(["Sunk", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S81(["Sunk", payload, successor]);
        }
    }


    export const S81 = {
        Sunk: S81_Sunk,

    };
    type S71_Miss =
        | [Message.S71_Miss['payload'], (Next: typeof S65) => State.S65]
        | [Message.S71_Miss['payload'], State.S65]
        ;

    function S71_Miss(
        payload: Message.S71_Miss['payload'],
        generateSuccessor: (Next: typeof S65) => State.S65
    ): State.S71;
    function S71_Miss(
        payload: Message.S71_Miss['payload'],
        succ: State.S65
    ): State.S71;
    function S71_Miss(...args: S71_Miss) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S65);
            return new State.S71(["Miss", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S71(["Miss", payload, successor]);
        }
    }


    export const S71 = {
        Miss: S71_Miss,

    };

    export function S64(handler: Handler.S64) {
        return new State.S64(handler);
    };
    export function S62(handler: Handler.S62) {
        return new State.S62(handler);
    };
    export function S68(handler: Handler.S68) {
        return new State.S68(handler);
    };
    export function S65(handler: Handler.S65) {
        return new State.S65(handler);
    };


    export const Initial = S62;

    export const S63 = () => new State.S63();
    export const Terminal = S63;

};