

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
    export enum S14 {
        PING = "PING",
    };

    export enum S16 {
        PONG = "PONG", BYE = "BYE",
    };

};

// =======
// Message
// =======
export namespace Message {

    export type S16PONG = {
        label: Labels.S16.PONG,
        payload: [number],
    };
    export type S16BYE = {
        label: Labels.S16.BYE,
        payload: [number],
    };

    export type S16 = | S16PONG | S16BYE;

    export type S14PING = {
        label: Labels.S14.PING,
        payload: [number],
    };

    export type S14 = | S14PING;


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
    export type S16 =
        MaybePromise<| [Labels.S16.PONG, Message.S16PONG['payload'], Implementation.S14] | [Labels.S16.BYE, Message.S16BYE['payload'], Implementation.S15]>;

    export type S14 = {
        [Labels.S14.PING]: (...payload: Message.S14PING['payload']) => MaybePromise<Implementation.S16>,

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

    export class S16 extends ISend {

        constructor(private handler: Handler.S16) {
            super();
        }

        performSend(
            next: EfsmTransitionHandler,
            cancel: (reason?: any) => void,
            sendMessage: (role: Roles.Peers, label: string, payload: any[]) => void
        ) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S16>) => {
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
    export class S14 extends IReceive {

        constructor(private handler: Handler.S14) {
            super();
        }

        prepareReceive(
            next: EfsmTransitionHandler,
            cancel: (reason?: any) => void,
            register: (from: Roles.Peers, messageHandler: MessageHandler) => void
        ) {
            const messageHandler = (message: any) => {
                const parsedMessage = JSON.parse(message) as Message.S14;
                switch (parsedMessage.label) {
                    case Labels.S14.PING: {
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
    export class S15 extends ITerminal {
    }


    // Type aliases for annotation
    // Const aliases for constructor
    export type Initial = S14;
    export const Initial = S14;
    export type Terminal = S15;
    export const Terminal = S15;
}

// =============
// Runtime types
// =============

export type EfsmTransitionHandler = (implementation: Implementation.Type) => void
export type MessageHandler = (message: any) => void