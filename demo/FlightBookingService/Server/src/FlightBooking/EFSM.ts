import { Credential as Cred } from "./Payment";


import {
    FromPromise,
    MaybePromise,
} from "./types";

// ==============
// Protocol roles
// ==============

export namespace Roles {

    type Self = "Server";

    // Constant value for value comparisons
    export const Self: Self = "Server";

    export enum Peers {
        Traveller = "Traveller",
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
    export enum S17 {
        Destination = "Destination",
    };
    export enum S20 {
        Confirm = "Confirm", Reject = "Reject",
    };

    export enum S19 {
        Available = "Available", Full = "Full",
    };

};

// =======
// Message
// =======
export namespace Message {

    export interface S19Available {
        label: Labels.S19.Available,
        payload: [number],
    };
    export interface S19Full {
        label: Labels.S19.Full,
        payload: [],
    };

    export type S19 = | S19Available | S19Full;

    export interface S17Destination {
        label: Labels.S17.Destination,
        payload: [string],
    };

    export type S17 = | S17Destination;

    export interface S20Confirm {
        label: Labels.S20.Confirm,
        payload: [Cred],
    };
    export interface S20Reject {
        label: Labels.S20.Reject,
        payload: [],
    };

    export type S20 = | S20Confirm | S20Reject;


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
    export type S19 =
        MaybePromise<| [Labels.S19.Available, Message.S19Available['payload'], Implementation.S20] | [Labels.S19.Full, Message.S19Full['payload'], Implementation.S17]>;

    export interface S17 {
        [Labels.S17.Destination]: (...payload: Message.S17Destination['payload']) => MaybePromise<Implementation.S19>,

    }
    export interface S20 {
        [Labels.S20.Confirm]: (...payload: Message.S20Confirm['payload']) => MaybePromise<Implementation.S18>,
        [Labels.S20.Reject]: (...payload: Message.S20Reject['payload']) => MaybePromise<Implementation.S18>,

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
        send: (role: Roles.Peers, label: string, payload: any[]) => void
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

    export class S19 extends ISend {

        constructor(private handler: Handler.S19) {
            super();
        }

        performSend(
            next: EfsmTransitionHandler,
            cancel: (reason?: any) => void,
            send: (role: Roles.Peers, label: string, payload: any[]) => void
        ) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S19>) => {
                send(Roles.Peers.Traveller, label, payload);
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
    export class S17 extends IReceive {

        constructor(private handler: Handler.S17) {
            super();
        }

        prepareReceive(
            next: EfsmTransitionHandler,
            cancel: (reason?: any) => void,
            register: (from: Roles.Peers, messageHandler: MessageHandler) => void
        ) {
            const messageHandler = (message: any) => {
                const parsedMessage = JSON.parse(message) as Message.S17;
                switch (parsedMessage.label) {
                    case Labels.S17.Destination: {
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

            register(Roles.Peers.Traveller, messageHandler);
        }

    }
    export class S20 extends IReceive {

        constructor(private handler: Handler.S20) {
            super();
        }

        prepareReceive(
            next: EfsmTransitionHandler,
            cancel: (reason?: any) => void,
            register: (from: Roles.Peers, messageHandler: MessageHandler) => void
        ) {
            const messageHandler = (message: any) => {
                const parsedMessage = JSON.parse(message) as Message.S20;
                switch (parsedMessage.label) {
                    case Labels.S20.Confirm: {
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
                    case Labels.S20.Reject: {
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

            register(Roles.Peers.Traveller, messageHandler);
        }

    }
    export class S18 extends ITerminal {
    }


    // Type aliases for annotation
    // Const aliases for constructor
    export type Initial = S17;
    export const Initial = S17;
    export type Terminal = S18;
    export const Terminal = S18;
}

// =============
// Runtime types
// =============

export type EfsmTransitionHandler = (implementation: Implementation.Type) => void
export type MessageHandler = (message: any) => void