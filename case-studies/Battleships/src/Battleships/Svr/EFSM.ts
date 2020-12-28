import { Location } from "../../Models";
import { Config } from "../../Models";
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

    export interface S199_Loser {
        label: "Loser",
        payload: [Location],
    };

    export type S199 = | S199_Loser;

    export interface S177_Hit {
        label: "Hit",
        payload: [Location],
    };
    export interface S177_Miss {
        label: "Miss",
        payload: [Location],
    };
    export interface S177_Sunk {
        label: "Sunk",
        payload: [Location],
    };
    export interface S177_Winner {
        label: "Winner",
        payload: [Location],
    };

    export type S177 = | S177_Hit | S177_Miss | S177_Sunk | S177_Winner;

    export interface S178_Hit {
        label: "Hit",
        payload: [Location],
    };

    export type S178 = | S178_Hit;

    export interface S180_Hit {
        label: "Hit",
        payload: [Location],
    };
    export interface S180_Miss {
        label: "Miss",
        payload: [Location],
    };
    export interface S180_Sunk {
        label: "Sunk",
        payload: [Location],
    };
    export interface S180_Winner {
        label: "Winner",
        payload: [Location],
    };

    export type S180 = | S180_Hit | S180_Miss | S180_Sunk | S180_Winner;

    export interface S181_Hit {
        label: "Hit",
        payload: [Location],
    };

    export type S181 = | S181_Hit;

    export interface S182_Miss {
        label: "Miss",
        payload: [Location],
    };

    export type S182 = | S182_Miss;

    export interface S183_Sunk {
        label: "Sunk",
        payload: [Location],
    };

    export type S183 = | S183_Sunk;

    export interface S184_Loser {
        label: "Loser",
        payload: [Location],
    };

    export type S184 = | S184_Loser;

    export interface S185_Miss {
        label: "Miss",
        payload: [Location],
    };

    export type S185 = | S185_Miss;

    export interface S192_Sunk {
        label: "Sunk",
        payload: [Location],
    };

    export type S192 = | S192_Sunk;

    export interface S173_Init {
        label: "Init",
        payload: [Config],
    };

    export type S173 = | S173_Init;

    export interface S175_Init {
        label: "Init",
        payload: [Config],
    };

    export type S175 = | S175_Init;

    export interface S176_Attack {
        label: "Attack",
        payload: [Location],
    };

    export type S176 = | S176_Attack;

    export interface S179_Attack {
        label: "Attack",
        payload: [Location],
    };

    export type S179 = | S179_Attack;


    export interface Channel {
        role: Role.All;
        label: string;
        payload: any[];
    };

    export const serialise = <T>(obj: T) => JSON.stringify(obj);
    export const deserialise = <T>(message: any) => JSON.parse(message) as T;

};

export namespace Handler {
    export type S199 =
        MaybePromise<
            | ["Loser", Message.S199_Loser['payload'], State.S174]

        >;
    export type S177 =
        MaybePromise<
            | ["Hit", Message.S177_Hit['payload'], State.S178]
            | ["Miss", Message.S177_Miss['payload'], State.S185]
            | ["Sunk", Message.S177_Sunk['payload'], State.S192]
            | ["Winner", Message.S177_Winner['payload'], State.S199]

        >;
    export type S178 =
        MaybePromise<
            | ["Hit", Message.S178_Hit['payload'], State.S179]

        >;
    export type S180 =
        MaybePromise<
            | ["Hit", Message.S180_Hit['payload'], State.S181]
            | ["Miss", Message.S180_Miss['payload'], State.S182]
            | ["Sunk", Message.S180_Sunk['payload'], State.S183]
            | ["Winner", Message.S180_Winner['payload'], State.S184]

        >;
    export type S181 =
        MaybePromise<
            | ["Hit", Message.S181_Hit['payload'], State.S176]

        >;
    export type S182 =
        MaybePromise<
            | ["Miss", Message.S182_Miss['payload'], State.S176]

        >;
    export type S183 =
        MaybePromise<
            | ["Sunk", Message.S183_Sunk['payload'], State.S176]

        >;
    export type S184 =
        MaybePromise<
            | ["Loser", Message.S184_Loser['payload'], State.S174]

        >;
    export type S185 =
        MaybePromise<
            | ["Miss", Message.S185_Miss['payload'], State.S179]

        >;
    export type S192 =
        MaybePromise<
            | ["Sunk", Message.S192_Sunk['payload'], State.S179]

        >;

    export interface S173 {
        "Init": (Next: typeof Factory.S175, ...payload: Message.S173_Init['payload']) => MaybePromise<State.S175>,

    };
    export interface S175 {
        "Init": (Next: typeof Factory.S176, ...payload: Message.S175_Init['payload']) => MaybePromise<State.S176>,

    };
    export interface S176 {
        "Attack": (Next: typeof Factory.S177, ...payload: Message.S176_Attack['payload']) => MaybePromise<State.S177>,

    };
    export interface S179 {
        "Attack": (Next: typeof Factory.S180, ...payload: Message.S179_Attack['payload']) => MaybePromise<State.S180>,

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

    export class S199 implements ISend {
        readonly type: 'Send' = 'Send';
        constructor(public handler: Handler.S199) { }

        performSend(next: StateTransitionHandler, cancel: Cancellation, send: SendStateHandler) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S199>) => {
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
    export class S177 implements ISend {
        readonly type: 'Send' = 'Send';
        constructor(public handler: Handler.S177) { }

        performSend(next: StateTransitionHandler, cancel: Cancellation, send: SendStateHandler) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S177>) => {
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
    export class S178 implements ISend {
        readonly type: 'Send' = 'Send';
        constructor(public handler: Handler.S178) { }

        performSend(next: StateTransitionHandler, cancel: Cancellation, send: SendStateHandler) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S178>) => {
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
    export class S180 implements ISend {
        readonly type: 'Send' = 'Send';
        constructor(public handler: Handler.S180) { }

        performSend(next: StateTransitionHandler, cancel: Cancellation, send: SendStateHandler) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S180>) => {
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
    export class S181 implements ISend {
        readonly type: 'Send' = 'Send';
        constructor(public handler: Handler.S181) { }

        performSend(next: StateTransitionHandler, cancel: Cancellation, send: SendStateHandler) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S181>) => {
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
    export class S182 implements ISend {
        readonly type: 'Send' = 'Send';
        constructor(public handler: Handler.S182) { }

        performSend(next: StateTransitionHandler, cancel: Cancellation, send: SendStateHandler) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S182>) => {
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
    export class S183 implements ISend {
        readonly type: 'Send' = 'Send';
        constructor(public handler: Handler.S183) { }

        performSend(next: StateTransitionHandler, cancel: Cancellation, send: SendStateHandler) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S183>) => {
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
    export class S184 implements ISend {
        readonly type: 'Send' = 'Send';
        constructor(public handler: Handler.S184) { }

        performSend(next: StateTransitionHandler, cancel: Cancellation, send: SendStateHandler) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S184>) => {
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
    export class S185 implements ISend {
        readonly type: 'Send' = 'Send';
        constructor(public handler: Handler.S185) { }

        performSend(next: StateTransitionHandler, cancel: Cancellation, send: SendStateHandler) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S185>) => {
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
    export class S192 implements ISend {
        readonly type: 'Send' = 'Send';
        constructor(public handler: Handler.S192) { }

        performSend(next: StateTransitionHandler, cancel: Cancellation, send: SendStateHandler) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S192>) => {
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


    export class S173 implements IReceive {
        readonly type: 'Receive' = 'Receive';
        constructor(public handler: Handler.S173) { }

        prepareReceive(next: StateTransitionHandler, cancel: Cancellation, register: ReceiveStateHandler) {
            const onReceive = (message: any) => {
                const parsed = JSON.parse(message) as Message.S173;
                switch (parsed.label) {
                    case "Init": {
                        try {
                            const successor = this.handler[parsed.label](Factory.S175, ...parsed.payload);
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
    export class S175 implements IReceive {
        readonly type: 'Receive' = 'Receive';
        constructor(public handler: Handler.S175) { }

        prepareReceive(next: StateTransitionHandler, cancel: Cancellation, register: ReceiveStateHandler) {
            const onReceive = (message: any) => {
                const parsed = JSON.parse(message) as Message.S175;
                switch (parsed.label) {
                    case "Init": {
                        try {
                            const successor = this.handler[parsed.label](Factory.S176, ...parsed.payload);
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
    export class S176 implements IReceive {
        readonly type: 'Receive' = 'Receive';
        constructor(public handler: Handler.S176) { }

        prepareReceive(next: StateTransitionHandler, cancel: Cancellation, register: ReceiveStateHandler) {
            const onReceive = (message: any) => {
                const parsed = JSON.parse(message) as Message.S176;
                switch (parsed.label) {
                    case "Attack": {
                        try {
                            const successor = this.handler[parsed.label](Factory.S177, ...parsed.payload);
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
    export class S179 implements IReceive {
        readonly type: 'Receive' = 'Receive';
        constructor(public handler: Handler.S179) { }

        prepareReceive(next: StateTransitionHandler, cancel: Cancellation, register: ReceiveStateHandler) {
            const onReceive = (message: any) => {
                const parsed = JSON.parse(message) as Message.S179;
                switch (parsed.label) {
                    case "Attack": {
                        try {
                            const successor = this.handler[parsed.label](Factory.S180, ...parsed.payload);
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



    export class S174 implements ITerminal {
        readonly type: 'Terminal' = 'Terminal';
    };


};

export namespace Factory {


    type S199_Loser =
        | [Message.S199_Loser['payload'], (Next: typeof S174) => State.S174]
        | [Message.S199_Loser['payload'], State.S174]
        ;

    function S199_Loser(
        payload: Message.S199_Loser['payload'],
        generateSuccessor: (Next: typeof S174) => State.S174
    ): State.S199;
    function S199_Loser(
        payload: Message.S199_Loser['payload'],
        succ: State.S174
    ): State.S199;
    function S199_Loser(...args: S199_Loser) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S174);
            return new State.S199(["Loser", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S199(["Loser", payload, successor]);
        }
    }


    export const S199 = {
        Loser: S199_Loser,

    };
    type S177_Hit =
        | [Message.S177_Hit['payload'], (Next: typeof S178) => State.S178]
        | [Message.S177_Hit['payload'], State.S178]
        ;

    function S177_Hit(
        payload: Message.S177_Hit['payload'],
        generateSuccessor: (Next: typeof S178) => State.S178
    ): State.S177;
    function S177_Hit(
        payload: Message.S177_Hit['payload'],
        succ: State.S178
    ): State.S177;
    function S177_Hit(...args: S177_Hit) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S178);
            return new State.S177(["Hit", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S177(["Hit", payload, successor]);
        }
    }

    type S177_Miss =
        | [Message.S177_Miss['payload'], (Next: typeof S185) => State.S185]
        | [Message.S177_Miss['payload'], State.S185]
        ;

    function S177_Miss(
        payload: Message.S177_Miss['payload'],
        generateSuccessor: (Next: typeof S185) => State.S185
    ): State.S177;
    function S177_Miss(
        payload: Message.S177_Miss['payload'],
        succ: State.S185
    ): State.S177;
    function S177_Miss(...args: S177_Miss) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S185);
            return new State.S177(["Miss", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S177(["Miss", payload, successor]);
        }
    }

    type S177_Sunk =
        | [Message.S177_Sunk['payload'], (Next: typeof S192) => State.S192]
        | [Message.S177_Sunk['payload'], State.S192]
        ;

    function S177_Sunk(
        payload: Message.S177_Sunk['payload'],
        generateSuccessor: (Next: typeof S192) => State.S192
    ): State.S177;
    function S177_Sunk(
        payload: Message.S177_Sunk['payload'],
        succ: State.S192
    ): State.S177;
    function S177_Sunk(...args: S177_Sunk) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S192);
            return new State.S177(["Sunk", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S177(["Sunk", payload, successor]);
        }
    }

    type S177_Winner =
        | [Message.S177_Winner['payload'], (Next: typeof S199) => State.S199]
        | [Message.S177_Winner['payload'], State.S199]
        ;

    function S177_Winner(
        payload: Message.S177_Winner['payload'],
        generateSuccessor: (Next: typeof S199) => State.S199
    ): State.S177;
    function S177_Winner(
        payload: Message.S177_Winner['payload'],
        succ: State.S199
    ): State.S177;
    function S177_Winner(...args: S177_Winner) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S199);
            return new State.S177(["Winner", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S177(["Winner", payload, successor]);
        }
    }


    export const S177 = {
        Hit: S177_Hit,
        Miss: S177_Miss,
        Sunk: S177_Sunk,
        Winner: S177_Winner,

    };
    type S178_Hit =
        | [Message.S178_Hit['payload'], (Next: typeof S179) => State.S179]
        | [Message.S178_Hit['payload'], State.S179]
        ;

    function S178_Hit(
        payload: Message.S178_Hit['payload'],
        generateSuccessor: (Next: typeof S179) => State.S179
    ): State.S178;
    function S178_Hit(
        payload: Message.S178_Hit['payload'],
        succ: State.S179
    ): State.S178;
    function S178_Hit(...args: S178_Hit) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S179);
            return new State.S178(["Hit", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S178(["Hit", payload, successor]);
        }
    }


    export const S178 = {
        Hit: S178_Hit,

    };
    type S180_Hit =
        | [Message.S180_Hit['payload'], (Next: typeof S181) => State.S181]
        | [Message.S180_Hit['payload'], State.S181]
        ;

    function S180_Hit(
        payload: Message.S180_Hit['payload'],
        generateSuccessor: (Next: typeof S181) => State.S181
    ): State.S180;
    function S180_Hit(
        payload: Message.S180_Hit['payload'],
        succ: State.S181
    ): State.S180;
    function S180_Hit(...args: S180_Hit) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S181);
            return new State.S180(["Hit", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S180(["Hit", payload, successor]);
        }
    }

    type S180_Miss =
        | [Message.S180_Miss['payload'], (Next: typeof S182) => State.S182]
        | [Message.S180_Miss['payload'], State.S182]
        ;

    function S180_Miss(
        payload: Message.S180_Miss['payload'],
        generateSuccessor: (Next: typeof S182) => State.S182
    ): State.S180;
    function S180_Miss(
        payload: Message.S180_Miss['payload'],
        succ: State.S182
    ): State.S180;
    function S180_Miss(...args: S180_Miss) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S182);
            return new State.S180(["Miss", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S180(["Miss", payload, successor]);
        }
    }

    type S180_Sunk =
        | [Message.S180_Sunk['payload'], (Next: typeof S183) => State.S183]
        | [Message.S180_Sunk['payload'], State.S183]
        ;

    function S180_Sunk(
        payload: Message.S180_Sunk['payload'],
        generateSuccessor: (Next: typeof S183) => State.S183
    ): State.S180;
    function S180_Sunk(
        payload: Message.S180_Sunk['payload'],
        succ: State.S183
    ): State.S180;
    function S180_Sunk(...args: S180_Sunk) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S183);
            return new State.S180(["Sunk", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S180(["Sunk", payload, successor]);
        }
    }

    type S180_Winner =
        | [Message.S180_Winner['payload'], (Next: typeof S184) => State.S184]
        | [Message.S180_Winner['payload'], State.S184]
        ;

    function S180_Winner(
        payload: Message.S180_Winner['payload'],
        generateSuccessor: (Next: typeof S184) => State.S184
    ): State.S180;
    function S180_Winner(
        payload: Message.S180_Winner['payload'],
        succ: State.S184
    ): State.S180;
    function S180_Winner(...args: S180_Winner) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S184);
            return new State.S180(["Winner", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S180(["Winner", payload, successor]);
        }
    }


    export const S180 = {
        Hit: S180_Hit,
        Miss: S180_Miss,
        Sunk: S180_Sunk,
        Winner: S180_Winner,

    };
    type S181_Hit =
        | [Message.S181_Hit['payload'], (Next: typeof S176) => State.S176]
        | [Message.S181_Hit['payload'], State.S176]
        ;

    function S181_Hit(
        payload: Message.S181_Hit['payload'],
        generateSuccessor: (Next: typeof S176) => State.S176
    ): State.S181;
    function S181_Hit(
        payload: Message.S181_Hit['payload'],
        succ: State.S176
    ): State.S181;
    function S181_Hit(...args: S181_Hit) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S176);
            return new State.S181(["Hit", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S181(["Hit", payload, successor]);
        }
    }


    export const S181 = {
        Hit: S181_Hit,

    };
    type S182_Miss =
        | [Message.S182_Miss['payload'], (Next: typeof S176) => State.S176]
        | [Message.S182_Miss['payload'], State.S176]
        ;

    function S182_Miss(
        payload: Message.S182_Miss['payload'],
        generateSuccessor: (Next: typeof S176) => State.S176
    ): State.S182;
    function S182_Miss(
        payload: Message.S182_Miss['payload'],
        succ: State.S176
    ): State.S182;
    function S182_Miss(...args: S182_Miss) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S176);
            return new State.S182(["Miss", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S182(["Miss", payload, successor]);
        }
    }


    export const S182 = {
        Miss: S182_Miss,

    };
    type S183_Sunk =
        | [Message.S183_Sunk['payload'], (Next: typeof S176) => State.S176]
        | [Message.S183_Sunk['payload'], State.S176]
        ;

    function S183_Sunk(
        payload: Message.S183_Sunk['payload'],
        generateSuccessor: (Next: typeof S176) => State.S176
    ): State.S183;
    function S183_Sunk(
        payload: Message.S183_Sunk['payload'],
        succ: State.S176
    ): State.S183;
    function S183_Sunk(...args: S183_Sunk) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S176);
            return new State.S183(["Sunk", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S183(["Sunk", payload, successor]);
        }
    }


    export const S183 = {
        Sunk: S183_Sunk,

    };
    type S184_Loser =
        | [Message.S184_Loser['payload'], (Next: typeof S174) => State.S174]
        | [Message.S184_Loser['payload'], State.S174]
        ;

    function S184_Loser(
        payload: Message.S184_Loser['payload'],
        generateSuccessor: (Next: typeof S174) => State.S174
    ): State.S184;
    function S184_Loser(
        payload: Message.S184_Loser['payload'],
        succ: State.S174
    ): State.S184;
    function S184_Loser(...args: S184_Loser) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S174);
            return new State.S184(["Loser", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S184(["Loser", payload, successor]);
        }
    }


    export const S184 = {
        Loser: S184_Loser,

    };
    type S185_Miss =
        | [Message.S185_Miss['payload'], (Next: typeof S179) => State.S179]
        | [Message.S185_Miss['payload'], State.S179]
        ;

    function S185_Miss(
        payload: Message.S185_Miss['payload'],
        generateSuccessor: (Next: typeof S179) => State.S179
    ): State.S185;
    function S185_Miss(
        payload: Message.S185_Miss['payload'],
        succ: State.S179
    ): State.S185;
    function S185_Miss(...args: S185_Miss) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S179);
            return new State.S185(["Miss", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S185(["Miss", payload, successor]);
        }
    }


    export const S185 = {
        Miss: S185_Miss,

    };
    type S192_Sunk =
        | [Message.S192_Sunk['payload'], (Next: typeof S179) => State.S179]
        | [Message.S192_Sunk['payload'], State.S179]
        ;

    function S192_Sunk(
        payload: Message.S192_Sunk['payload'],
        generateSuccessor: (Next: typeof S179) => State.S179
    ): State.S192;
    function S192_Sunk(
        payload: Message.S192_Sunk['payload'],
        succ: State.S179
    ): State.S192;
    function S192_Sunk(...args: S192_Sunk) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S179);
            return new State.S192(["Sunk", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S192(["Sunk", payload, successor]);
        }
    }


    export const S192 = {
        Sunk: S192_Sunk,

    };

    export function S173(handler: Handler.S173) {
        return new State.S173(handler);
    };
    export function S175(handler: Handler.S175) {
        return new State.S175(handler);
    };
    export function S176(handler: Handler.S176) {
        return new State.S176(handler);
    };
    export function S179(handler: Handler.S179) {
        return new State.S179(handler);
    };


    export const Initial = S173;

    export const S174 = () => new State.S174();
    export const Terminal = S174;


};