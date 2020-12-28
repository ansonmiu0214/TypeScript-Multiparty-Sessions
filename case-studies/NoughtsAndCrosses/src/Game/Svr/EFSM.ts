import { Coordinate as Point } from "../../GameTypes";
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

    export interface S20_Lose {
        label: "Lose",
        payload: [Point],
    };
    export interface S20_Draw {
        label: "Draw",
        payload: [Point],
    };
    export interface S20_Update {
        label: "Update",
        payload: [Point],
    };

    export type S20 = | S20_Lose | S20_Draw | S20_Update;

    export interface S21_Win {
        label: "Win",
        payload: [Point],
    };

    export type S21 = | S21_Win;

    export interface S22_Draw {
        label: "Draw",
        payload: [Point],
    };

    export type S22 = | S22_Draw;

    export interface S23_Update {
        label: "Update",
        payload: [Point],
    };

    export type S23 = | S23_Update;

    export interface S15_Lose {
        label: "Lose",
        payload: [Point],
    };
    export interface S15_Draw {
        label: "Draw",
        payload: [Point],
    };
    export interface S15_Update {
        label: "Update",
        payload: [Point],
    };

    export type S15 = | S15_Lose | S15_Draw | S15_Update;

    export interface S16_Win {
        label: "Win",
        payload: [Point],
    };

    export type S16 = | S16_Win;

    export interface S17_Draw {
        label: "Draw",
        payload: [Point],
    };

    export type S17 = | S17_Draw;

    export interface S18_Update {
        label: "Update",
        payload: [Point],
    };

    export type S18 = | S18_Update;

    export interface S13_Pos {
        label: "Pos",
        payload: [Point],
    };

    export type S13 = | S13_Pos;

    export interface S19_Pos {
        label: "Pos",
        payload: [Point],
    };

    export type S19 = | S19_Pos;


    export interface Channel {
        role: Role.All;
        label: string;
        payload: any[];
    };

    export const serialise = <T>(obj: T) => JSON.stringify(obj);
    export const deserialise = <T>(message: any) => JSON.parse(message) as T;

};

export namespace Handler {
    export type S20 =
        MaybePromise<
            | ["Lose", Message.S20_Lose['payload'], State.S21]
            | ["Draw", Message.S20_Draw['payload'], State.S22]
            | ["Update", Message.S20_Update['payload'], State.S23]

        >;
    export type S21 =
        MaybePromise<
            | ["Win", Message.S21_Win['payload'], State.S14]

        >;
    export type S22 =
        MaybePromise<
            | ["Draw", Message.S22_Draw['payload'], State.S14]

        >;
    export type S23 =
        MaybePromise<
            | ["Update", Message.S23_Update['payload'], State.S13]

        >;
    export type S15 =
        MaybePromise<
            | ["Lose", Message.S15_Lose['payload'], State.S16]
            | ["Draw", Message.S15_Draw['payload'], State.S17]
            | ["Update", Message.S15_Update['payload'], State.S18]

        >;
    export type S16 =
        MaybePromise<
            | ["Win", Message.S16_Win['payload'], State.S14]

        >;
    export type S17 =
        MaybePromise<
            | ["Draw", Message.S17_Draw['payload'], State.S14]

        >;
    export type S18 =
        MaybePromise<
            | ["Update", Message.S18_Update['payload'], State.S19]

        >;

    export interface S13 {
        "Pos": (Next: typeof Factory.S15, ...payload: Message.S13_Pos['payload']) => MaybePromise<State.S15>,

    };
    export interface S19 {
        "Pos": (Next: typeof Factory.S20, ...payload: Message.S19_Pos['payload']) => MaybePromise<State.S20>,

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

    export class S20 implements ISend {
        readonly type: 'Send' = 'Send';
        constructor(public handler: Handler.S20) { }

        performSend(next: StateTransitionHandler, cancel: Cancellation, send: SendStateHandler) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S20>) => {
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
    export class S21 implements ISend {
        readonly type: 'Send' = 'Send';
        constructor(public handler: Handler.S21) { }

        performSend(next: StateTransitionHandler, cancel: Cancellation, send: SendStateHandler) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S21>) => {
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
    export class S22 implements ISend {
        readonly type: 'Send' = 'Send';
        constructor(public handler: Handler.S22) { }

        performSend(next: StateTransitionHandler, cancel: Cancellation, send: SendStateHandler) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S22>) => {
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
    export class S23 implements ISend {
        readonly type: 'Send' = 'Send';
        constructor(public handler: Handler.S23) { }

        performSend(next: StateTransitionHandler, cancel: Cancellation, send: SendStateHandler) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S23>) => {
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
    export class S15 implements ISend {
        readonly type: 'Send' = 'Send';
        constructor(public handler: Handler.S15) { }

        performSend(next: StateTransitionHandler, cancel: Cancellation, send: SendStateHandler) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S15>) => {
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
    export class S16 implements ISend {
        readonly type: 'Send' = 'Send';
        constructor(public handler: Handler.S16) { }

        performSend(next: StateTransitionHandler, cancel: Cancellation, send: SendStateHandler) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S16>) => {
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
    export class S17 implements ISend {
        readonly type: 'Send' = 'Send';
        constructor(public handler: Handler.S17) { }

        performSend(next: StateTransitionHandler, cancel: Cancellation, send: SendStateHandler) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S17>) => {
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
    export class S18 implements ISend {
        readonly type: 'Send' = 'Send';
        constructor(public handler: Handler.S18) { }

        performSend(next: StateTransitionHandler, cancel: Cancellation, send: SendStateHandler) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S18>) => {
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


    export class S13 implements IReceive {
        readonly type: 'Receive' = 'Receive';
        constructor(public handler: Handler.S13) { }

        prepareReceive(next: StateTransitionHandler, cancel: Cancellation, register: ReceiveStateHandler) {
            const onReceive = (message: any) => {
                const parsed = JSON.parse(message) as Message.S13;
                switch (parsed.label) {
                    case "Pos": {
                        try {
                            const successor = this.handler[parsed.label](Factory.S15, ...parsed.payload);
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
    export class S19 implements IReceive {
        readonly type: 'Receive' = 'Receive';
        constructor(public handler: Handler.S19) { }

        prepareReceive(next: StateTransitionHandler, cancel: Cancellation, register: ReceiveStateHandler) {
            const onReceive = (message: any) => {
                const parsed = JSON.parse(message) as Message.S19;
                switch (parsed.label) {
                    case "Pos": {
                        try {
                            const successor = this.handler[parsed.label](Factory.S20, ...parsed.payload);
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



    export class S14 implements ITerminal {
        readonly type: 'Terminal' = 'Terminal';
    };


};

export namespace Factory {


    type S20_Lose =
        | [Message.S20_Lose['payload'], (Next: typeof S21) => State.S21]
        | [Message.S20_Lose['payload'], State.S21]
        ;

    function S20_Lose(
        payload: Message.S20_Lose['payload'],
        generateSuccessor: (Next: typeof S21) => State.S21
    ): State.S20;
    function S20_Lose(
        payload: Message.S20_Lose['payload'],
        succ: State.S21
    ): State.S20;
    function S20_Lose(...args: S20_Lose) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S21);
            return new State.S20(["Lose", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S20(["Lose", payload, successor]);
        }
    }

    type S20_Draw =
        | [Message.S20_Draw['payload'], (Next: typeof S22) => State.S22]
        | [Message.S20_Draw['payload'], State.S22]
        ;

    function S20_Draw(
        payload: Message.S20_Draw['payload'],
        generateSuccessor: (Next: typeof S22) => State.S22
    ): State.S20;
    function S20_Draw(
        payload: Message.S20_Draw['payload'],
        succ: State.S22
    ): State.S20;
    function S20_Draw(...args: S20_Draw) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S22);
            return new State.S20(["Draw", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S20(["Draw", payload, successor]);
        }
    }

    type S20_Update =
        | [Message.S20_Update['payload'], (Next: typeof S23) => State.S23]
        | [Message.S20_Update['payload'], State.S23]
        ;

    function S20_Update(
        payload: Message.S20_Update['payload'],
        generateSuccessor: (Next: typeof S23) => State.S23
    ): State.S20;
    function S20_Update(
        payload: Message.S20_Update['payload'],
        succ: State.S23
    ): State.S20;
    function S20_Update(...args: S20_Update) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S23);
            return new State.S20(["Update", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S20(["Update", payload, successor]);
        }
    }


    export const S20 = {
        Lose: S20_Lose,
        Draw: S20_Draw,
        Update: S20_Update,

    };
    type S21_Win =
        | [Message.S21_Win['payload'], (Next: typeof S14) => State.S14]
        | [Message.S21_Win['payload'], State.S14]
        ;

    function S21_Win(
        payload: Message.S21_Win['payload'],
        generateSuccessor: (Next: typeof S14) => State.S14
    ): State.S21;
    function S21_Win(
        payload: Message.S21_Win['payload'],
        succ: State.S14
    ): State.S21;
    function S21_Win(...args: S21_Win) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S14);
            return new State.S21(["Win", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S21(["Win", payload, successor]);
        }
    }


    export const S21 = {
        Win: S21_Win,

    };
    type S22_Draw =
        | [Message.S22_Draw['payload'], (Next: typeof S14) => State.S14]
        | [Message.S22_Draw['payload'], State.S14]
        ;

    function S22_Draw(
        payload: Message.S22_Draw['payload'],
        generateSuccessor: (Next: typeof S14) => State.S14
    ): State.S22;
    function S22_Draw(
        payload: Message.S22_Draw['payload'],
        succ: State.S14
    ): State.S22;
    function S22_Draw(...args: S22_Draw) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S14);
            return new State.S22(["Draw", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S22(["Draw", payload, successor]);
        }
    }


    export const S22 = {
        Draw: S22_Draw,

    };
    type S23_Update =
        | [Message.S23_Update['payload'], (Next: typeof S13) => State.S13]
        | [Message.S23_Update['payload'], State.S13]
        ;

    function S23_Update(
        payload: Message.S23_Update['payload'],
        generateSuccessor: (Next: typeof S13) => State.S13
    ): State.S23;
    function S23_Update(
        payload: Message.S23_Update['payload'],
        succ: State.S13
    ): State.S23;
    function S23_Update(...args: S23_Update) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S13);
            return new State.S23(["Update", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S23(["Update", payload, successor]);
        }
    }


    export const S23 = {
        Update: S23_Update,

    };
    type S15_Lose =
        | [Message.S15_Lose['payload'], (Next: typeof S16) => State.S16]
        | [Message.S15_Lose['payload'], State.S16]
        ;

    function S15_Lose(
        payload: Message.S15_Lose['payload'],
        generateSuccessor: (Next: typeof S16) => State.S16
    ): State.S15;
    function S15_Lose(
        payload: Message.S15_Lose['payload'],
        succ: State.S16
    ): State.S15;
    function S15_Lose(...args: S15_Lose) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S16);
            return new State.S15(["Lose", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S15(["Lose", payload, successor]);
        }
    }

    type S15_Draw =
        | [Message.S15_Draw['payload'], (Next: typeof S17) => State.S17]
        | [Message.S15_Draw['payload'], State.S17]
        ;

    function S15_Draw(
        payload: Message.S15_Draw['payload'],
        generateSuccessor: (Next: typeof S17) => State.S17
    ): State.S15;
    function S15_Draw(
        payload: Message.S15_Draw['payload'],
        succ: State.S17
    ): State.S15;
    function S15_Draw(...args: S15_Draw) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S17);
            return new State.S15(["Draw", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S15(["Draw", payload, successor]);
        }
    }

    type S15_Update =
        | [Message.S15_Update['payload'], (Next: typeof S18) => State.S18]
        | [Message.S15_Update['payload'], State.S18]
        ;

    function S15_Update(
        payload: Message.S15_Update['payload'],
        generateSuccessor: (Next: typeof S18) => State.S18
    ): State.S15;
    function S15_Update(
        payload: Message.S15_Update['payload'],
        succ: State.S18
    ): State.S15;
    function S15_Update(...args: S15_Update) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S18);
            return new State.S15(["Update", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S15(["Update", payload, successor]);
        }
    }


    export const S15 = {
        Lose: S15_Lose,
        Draw: S15_Draw,
        Update: S15_Update,

    };
    type S16_Win =
        | [Message.S16_Win['payload'], (Next: typeof S14) => State.S14]
        | [Message.S16_Win['payload'], State.S14]
        ;

    function S16_Win(
        payload: Message.S16_Win['payload'],
        generateSuccessor: (Next: typeof S14) => State.S14
    ): State.S16;
    function S16_Win(
        payload: Message.S16_Win['payload'],
        succ: State.S14
    ): State.S16;
    function S16_Win(...args: S16_Win) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S14);
            return new State.S16(["Win", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S16(["Win", payload, successor]);
        }
    }


    export const S16 = {
        Win: S16_Win,

    };
    type S17_Draw =
        | [Message.S17_Draw['payload'], (Next: typeof S14) => State.S14]
        | [Message.S17_Draw['payload'], State.S14]
        ;

    function S17_Draw(
        payload: Message.S17_Draw['payload'],
        generateSuccessor: (Next: typeof S14) => State.S14
    ): State.S17;
    function S17_Draw(
        payload: Message.S17_Draw['payload'],
        succ: State.S14
    ): State.S17;
    function S17_Draw(...args: S17_Draw) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S14);
            return new State.S17(["Draw", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S17(["Draw", payload, successor]);
        }
    }


    export const S17 = {
        Draw: S17_Draw,

    };
    type S18_Update =
        | [Message.S18_Update['payload'], (Next: typeof S19) => State.S19]
        | [Message.S18_Update['payload'], State.S19]
        ;

    function S18_Update(
        payload: Message.S18_Update['payload'],
        generateSuccessor: (Next: typeof S19) => State.S19
    ): State.S18;
    function S18_Update(
        payload: Message.S18_Update['payload'],
        succ: State.S19
    ): State.S18;
    function S18_Update(...args: S18_Update) {
        if (typeof args[1] === 'function') {
            const [payload, generateSuccessor] = args;
            const successor = generateSuccessor(S19);
            return new State.S18(["Update", payload, successor]);
        } else {
            const [payload, successor] = args;
            return new State.S18(["Update", payload, successor]);
        }
    }


    export const S18 = {
        Update: S18_Update,

    };

    export function S13(handler: Handler.S13) {
        return new State.S13(handler);
    };
    export function S19(handler: Handler.S19) {
        return new State.S19(handler);
    };


    export const Initial = S13;

    export const S14 = () => new State.S14();
    export const Terminal = S14;

};