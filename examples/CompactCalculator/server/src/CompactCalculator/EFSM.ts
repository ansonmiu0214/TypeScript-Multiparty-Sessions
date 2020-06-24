

import {
    FromPromise,
    MaybePromise,
} from "./types";

// ==============
// Protocol roles
// ==============

export namespace Roles {

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

// ==============
// Message labels
// ==============

export namespace Labels {
    export enum S44 {
        Add = "Add", Mult = "Mult", Double = "Double", Quit = "Quit",
    };

    export enum S46 {
        Res = "Res",
    };
    export enum S47 {
        Res = "Res",
    };
    export enum S48 {
        Res = "Res",
    };
    export enum S49 {
        Terminate = "Terminate",
    };

};

// =======
// Message
// =======
export namespace Message {

    export type S46Res = {
        label: Labels.S46.Res,
        payload: [number],
    };

    export type S46 = | S46Res;

    export type S47Res = {
        label: Labels.S47.Res,
        payload: [number],
    };

    export type S47 = | S47Res;

    export type S48Res = {
        label: Labels.S48.Res,
        payload: [number],
    };

    export type S48 = | S48Res;

    export type S49Terminate = {
        label: Labels.S49.Terminate,
        payload: [],
    };

    export type S49 = | S49Terminate;

    export type S44Add = {
        label: Labels.S44.Add,
        payload: [number, number],
    };
    export type S44Mult = {
        label: Labels.S44.Mult,
        payload: [number, number],
    };
    export type S44Double = {
        label: Labels.S44.Double,
        payload: [number],
    };
    export type S44Quit = {
        label: Labels.S44.Quit,
        payload: [],
    };

    export type S44 = | S44Add | S44Mult | S44Double | S44Quit;


    export interface ConnectInvite {
        connect: Roles.Peers
    };

    export const ConnectConfirm = {
        connected: true
    };

    export interface Channel {
        role: Roles.All
        label: string
        payload: any[]
    };

    export const toChannel = (role: Roles.All, label: string, payload: any[]) => (
        { role, label, payload }
    );
};

// ================
// Message handlers
// ================

export namespace Handler {
    export type S46 =
        MaybePromise<| [Labels.S46.Res, Message.S46Res['payload'], Implementation.S44]>;
    export type S47 =
        MaybePromise<| [Labels.S47.Res, Message.S47Res['payload'], Implementation.S44]>;
    export type S48 =
        MaybePromise<| [Labels.S48.Res, Message.S48Res['payload'], Implementation.S44]>;
    export type S49 =
        MaybePromise<| [Labels.S49.Terminate, Message.S49Terminate['payload'], Implementation.S45]>;

    export type S44 = {
        [Labels.S44.Add]: (...payload: Message.S44Add['payload']) => MaybePromise<Implementation.S46>,
        [Labels.S44.Mult]: (...payload: Message.S44Mult['payload']) => MaybePromise<Implementation.S47>,
        [Labels.S44.Double]: (...payload: Message.S44Double['payload']) => MaybePromise<Implementation.S48>,
        [Labels.S44.Quit]: (...payload: Message.S44Quit['payload']) => MaybePromise<Implementation.S49>,

    }

};

// ===========
//
// ===========

abstract class ISend {
    type: 'Send' = 'Send';
    abstract performSend(
        next: EfsmTransitionHandler,
        cancel: (reason?: any) => void,
        sendMessage: (role: Roles.Peers, label: string, payload: any[]) => void
    ): void;
}

abstract class IReceive {
    type: 'Receive' = 'Receive';
    abstract prepareReceive(
        next: EfsmTransitionHandler,
        cancel: (reason?: any) => void,
        register: (from: Roles.Peers, messageHandler: MessageHandler) => void
    ): void;
}

abstract class ITerminal {
    type: 'Terminal' = 'Terminal';
}

// =================================
// "Implementation"
// := wrapper around message handler
// =================================

export namespace Implementation {

    export type Type = ISend | IReceive | ITerminal;

    export class S46 extends ISend {

        constructor(private handler: Handler.S46) {
            super();
        }

        performSend(
            next: EfsmTransitionHandler,
            cancel: (reason?: any) => void,
            sendMessage: (role: Roles.Peers, label: string, payload: any[]) => void
        ) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S46>) => {
                sendMessage(Roles.Peers.Client, label, payload);
                return next(successor);
            }
            if (this.handler instanceof Promise) {
                // Asynchronous implementation -- wait for completion
                this.handler.then(thunk).catch(cancel);
            } else {
                try {
                    thunk(this.handler);
                } catch (error) {
                    cancel(error);
                }
            }
        }

    }
    export class S47 extends ISend {

        constructor(private handler: Handler.S47) {
            super();
        }

        performSend(
            next: EfsmTransitionHandler,
            cancel: (reason?: any) => void,
            sendMessage: (role: Roles.Peers, label: string, payload: any[]) => void
        ) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S47>) => {
                sendMessage(Roles.Peers.Client, label, payload);
                return next(successor);
            }
            if (this.handler instanceof Promise) {
                // Asynchronous implementation -- wait for completion
                this.handler.then(thunk).catch(cancel);
            } else {
                try {
                    thunk(this.handler);
                } catch (error) {
                    cancel(error);
                }
            }
        }

    }
    export class S48 extends ISend {

        constructor(private handler: Handler.S48) {
            super();
        }

        performSend(
            next: EfsmTransitionHandler,
            cancel: (reason?: any) => void,
            sendMessage: (role: Roles.Peers, label: string, payload: any[]) => void
        ) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S48>) => {
                sendMessage(Roles.Peers.Client, label, payload);
                return next(successor);
            }
            if (this.handler instanceof Promise) {
                // Asynchronous implementation -- wait for completion
                this.handler.then(thunk).catch(cancel);
            } else {
                try {
                    thunk(this.handler);
                } catch (error) {
                    cancel(error);
                }
            }
        }

    }
    export class S49 extends ISend {

        constructor(private handler: Handler.S49) {
            super();
        }

        performSend(
            next: EfsmTransitionHandler,
            cancel: (reason?: any) => void,
            sendMessage: (role: Roles.Peers, label: string, payload: any[]) => void
        ) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S49>) => {
                sendMessage(Roles.Peers.Client, label, payload);
                return next(successor);
            }
            if (this.handler instanceof Promise) {
                // Asynchronous implementation -- wait for completion
                this.handler.then(thunk).catch(cancel);
            } else {
                try {
                    thunk(this.handler);
                } catch (error) {
                    cancel(error);
                }
            }
        }

    }
    export class S44 extends IReceive {

        constructor(private handler: Handler.S44) {
            super();
        }

        prepareReceive(
            next: EfsmTransitionHandler,
            cancel: (reason?: any) => void,
            register: (from: Roles.Peers, messageHandler: MessageHandler) => void
        ) {
            const messageHandler = (message: any) => {
                const parsedMessage = JSON.parse(message) as Message.S44;
                switch (parsedMessage.label) {
                    case Labels.S44.Add: {
                        try {
                            const successor = this.handler[parsedMessage.label](...parsedMessage.payload);
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
                    case Labels.S44.Mult: {
                        try {
                            const successor = this.handler[parsedMessage.label](...parsedMessage.payload);
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
                    case Labels.S44.Double: {
                        try {
                            const successor = this.handler[parsedMessage.label](...parsedMessage.payload);
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
                    case Labels.S44.Quit: {
                        try {
                            const successor = this.handler[parsedMessage.label](...parsedMessage.payload);
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
            }

            register(Roles.Peers.Client, messageHandler);
        }

    }
    export class S45 extends ITerminal {
    }


    // Type aliases for annotation
    // Const aliases for constructor
    export type Initial = S44;
    export const Initial = S44;
    export type Terminal = S45;
    export const Terminal = S45;
}

// =============
// Runtime types
// =============

export type EfsmTransitionHandler = (implementation: Implementation.Type) => void
export type MessageHandler = (message: any) => void