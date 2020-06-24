

import {
    FromPromise,
    MaybePromise,
} from "./types";

// ==============
// Protocol roles
// ==============

export namespace Roles {

    type Self = "S";

    // Constant value for value comparisons
    export const Self: Self = "S";

    export enum Peers {
        A = "A", B = "B",
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
    export enum S29 {
        title = "title",
    };
    export enum S33 {
        ok = "ok", quit = "quit",
    };

    export enum S31 {
        quote = "quote",
    };
    export enum S32 {
        quote = "quote",
    };
    export enum S34 {
        date = "date",
    };

};

// =======
// Message
// =======
export namespace Message {

    export type S31quote = {
        label: Labels.S31.quote,
        payload: [number],
    };

    export type S31 = | S31quote;

    export type S32quote = {
        label: Labels.S32.quote,
        payload: [number],
    };

    export type S32 = | S32quote;

    export type S34date = {
        label: Labels.S34.date,
        payload: [string],
    };

    export type S34 = | S34date;

    export type S29title = {
        label: Labels.S29.title,
        payload: [string],
    };

    export type S29 = | S29title;

    export type S33ok = {
        label: Labels.S33.ok,
        payload: [string],
    };
    export type S33quit = {
        label: Labels.S33.quit,
        payload: [],
    };

    export type S33 = | S33ok | S33quit;


    export interface ConnectRequest {
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
    export type S31 =
        MaybePromise<| [Labels.S31.quote, Message.S31quote['payload'], Implementation.S32]>;
    export type S32 =
        MaybePromise<| [Labels.S32.quote, Message.S32quote['payload'], Implementation.S33]>;
    export type S34 =
        MaybePromise<| [Labels.S34.date, Message.S34date['payload'], Implementation.S30]>;

    export type S29 = {
        [Labels.S29.title]: (...payload: Message.S29title['payload']) => MaybePromise<Implementation.S31>,

    }
    export type S33 = {
        [Labels.S33.ok]: (...payload: Message.S33ok['payload']) => MaybePromise<Implementation.S34>,
        [Labels.S33.quit]: (...payload: Message.S33quit['payload']) => MaybePromise<Implementation.S30>,

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

    export class S31 extends ISend {

        constructor(private handler: Handler.S31) {
            super();
        }

        performSend(
            next: EfsmTransitionHandler,
            cancel: (reason?: any) => void,
            sendMessage: (role: Roles.Peers, label: string, payload: any[]) => void
        ) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S31>) => {
                sendMessage(Roles.Peers.A, label, payload);
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
    export class S32 extends ISend {

        constructor(private handler: Handler.S32) {
            super();
        }

        performSend(
            next: EfsmTransitionHandler,
            cancel: (reason?: any) => void,
            sendMessage: (role: Roles.Peers, label: string, payload: any[]) => void
        ) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S32>) => {
                sendMessage(Roles.Peers.B, label, payload);
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
    export class S34 extends ISend {

        constructor(private handler: Handler.S34) {
            super();
        }

        performSend(
            next: EfsmTransitionHandler,
            cancel: (reason?: any) => void,
            sendMessage: (role: Roles.Peers, label: string, payload: any[]) => void
        ) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S34>) => {
                sendMessage(Roles.Peers.B, label, payload);
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
    export class S29 extends IReceive {

        constructor(private handler: Handler.S29) {
            super();
        }

        prepareReceive(
            next: EfsmTransitionHandler,
            cancel: (reason?: any) => void,
            register: (from: Roles.Peers, messageHandler: MessageHandler) => void
        ) {
            const messageHandler = (message: any) => {
                const parsedMessage = JSON.parse(message) as Message.S29;
                switch (parsedMessage.label) {
                    case Labels.S29.title: {
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

            register(Roles.Peers.A, messageHandler);
        }

    }
    export class S33 extends IReceive {

        constructor(private handler: Handler.S33) {
            super();
        }

        prepareReceive(
            next: EfsmTransitionHandler,
            cancel: (reason?: any) => void,
            register: (from: Roles.Peers, messageHandler: MessageHandler) => void
        ) {
            const messageHandler = (message: any) => {
                const parsedMessage = JSON.parse(message) as Message.S33;
                switch (parsedMessage.label) {
                    case Labels.S33.ok: {
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
                    case Labels.S33.quit: {
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

            register(Roles.Peers.B, messageHandler);
        }

    }
    export class S30 extends ITerminal {
    }


    // Type aliases for annotation
    // Const aliases for constructor
    export type Initial = S29;
    export const Initial = S29;
    export type Terminal = S30;
    export const Terminal = S30;
}

// =============
// Runtime types
// =============

export type EfsmTransitionHandler = (implementation: Implementation.Type) => void
export type MessageHandler = (message: any) => void