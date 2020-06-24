

type MaybePromise<T> = T | Promise<T>;
type FromJust<T> = T extends MaybePromise<infer R> ? R : unknown;

// ==============
// Protocol roles
// ==============

export enum Roles {
    Alice = "Alice", Bob = "Bob",
};

// ==============
// Message labels
// ==============

export namespace Labels {
    export enum S7 {
        Bid = "Bid",
    };
    export enum S9 {
        TwoBids = "TwoBids",
    };

    export enum S10 {
        Win = "Win", Lose = "Lose",
    };
    export enum S11 {
        Lose = "Lose",
    };
    export enum S12 {
        Win = "Win",
    };

};

// =======
// Message
// =======
namespace Message {

    export type S10Win = {
        label: Labels.S10.Win,
        payload: [],
    };
    export type S10Lose = {
        label: Labels.S10.Lose,
        payload: [],
    };

    export type S10 = | S10Win | S10Lose;

    export type S11Lose = {
        label: Labels.S11.Lose,
        payload: [],
    };

    export type S11 = | S11Lose;

    export type S12Win = {
        label: Labels.S12.Win,
        payload: [],
    };

    export type S12 = | S12Win;

    export type S7Bid = {
        label: Labels.S7.Bid,
        payload: [number],
    };

    export type S7 = | S7Bid;

    export type S9TwoBids = {
        label: Labels.S9.TwoBids,
        payload: [number, number],
    };

    export type S9 = | S9TwoBids;

};

// ================
// Message handlers
// ================

export namespace Handler {
    export type S10 =
        MaybePromise<| [Labels.S10.Win, Message.S10Win['payload'], Implementation.S11] | [Labels.S10.Lose, Message.S10Lose['payload'], Implementation.S12]>;
    export type S11 =
        MaybePromise<| [Labels.S11.Lose, Message.S11Lose['payload'], Implementation.S8]>;
    export type S12 =
        MaybePromise<| [Labels.S12.Win, Message.S12Win['payload'], Implementation.S8]>;

    export type S7 = {
        [Labels.S7.Bid]: (...payload: Message.S7Bid['payload']) => MaybePromise<Implementation.S9>,

    }
    export type S9 = {
        [Labels.S9.TwoBids]: (...payload: Message.S9TwoBids['payload']) => MaybePromise<Implementation.S10>,

    }

    export type S8 = 'Terminate';
};

// =================================
// "Implementation"
// := wrapper around message handler
// =================================

export namespace Implementation {
    abstract class Send {
        type: 'Send' = 'Send';
        abstract performSend(
            next: EfsmTransitionHandler,
            sendMessage: (role: Roles, label: string, payload: any[]) => void
        ): void;
    }

    abstract class Receive {
        type: 'Receive' = 'Receive';
        abstract prepareReceive(
            next: EfsmTransitionHandler,
            register: (from: Roles, messageHandler: MessageHandler) => void
        ): void;
    }

    abstract class Terminal {
        type: 'Terminal' = 'Terminal';
    }

    export type Type = Send | Receive | Terminal;

    export class S10 extends Send {

        constructor(private handler: Handler.S10) {
            super();
        }

        performSend(
            next: EfsmTransitionHandler,
            sendMessage: (role: Roles, label: string, payload: any[]) => void
        ) {
            const thunk = ([label, payload, successor]: FromJust<Handler.S10>) => {
                sendMessage(Roles.Alice, label, payload);
                return next(successor);
            }
            if (this.handler instanceof Promise) {
                // Asynchronous implementation -- wait for completion
                this.handler.then(thunk).catch(console.error);
            } else {
                thunk(this.handler);
            }
        }

    }
    export class S11 extends Send {

        constructor(private handler: Handler.S11) {
            super();
        }

        performSend(
            next: EfsmTransitionHandler,
            sendMessage: (role: Roles, label: string, payload: any[]) => void
        ) {
            const thunk = ([label, payload, successor]: FromJust<Handler.S11>) => {
                sendMessage(Roles.Bob, label, payload);
                return next(successor);
            }
            if (this.handler instanceof Promise) {
                // Asynchronous implementation -- wait for completion
                this.handler.then(thunk).catch(console.error);
            } else {
                thunk(this.handler);
            }
        }

    }
    export class S12 extends Send {

        constructor(private handler: Handler.S12) {
            super();
        }

        performSend(
            next: EfsmTransitionHandler,
            sendMessage: (role: Roles, label: string, payload: any[]) => void
        ) {
            const thunk = ([label, payload, successor]: FromJust<Handler.S12>) => {
                sendMessage(Roles.Bob, label, payload);
                return next(successor);
            }
            if (this.handler instanceof Promise) {
                // Asynchronous implementation -- wait for completion
                this.handler.then(thunk).catch(console.error);
            } else {
                thunk(this.handler);
            }
        }

    }
    export class S7 extends Receive {

        constructor(private handler: Handler.S7) {
            super();
        }

        prepareReceive(
            next: EfsmTransitionHandler,
            register: (from: Roles, messageHandler: MessageHandler) => void
        ) {
            const messageHandler = (message: any) => {
                const parsedMessage = JSON.parse(message) as Message.S7;
                switch (parsedMessage.label) {
                    case Labels.S7.Bid: {
                        const successor = this.handler[parsedMessage.label](...parsedMessage.payload);
                        if (successor instanceof Promise) {
                            successor.then(next).catch(console.error);
                        } else {
                            next(successor);
                        }
                        return;
                    }

                    // default: {
                    //   throw new Error(`Unexpected receive: ${parsedMessage.label}`);
                    // }
                }
            }

            register(Roles.Alice, messageHandler);
        }

    }
    export class S9 extends Receive {

        constructor(private handler: Handler.S9) {
            super();
        }

        prepareReceive(
            next: EfsmTransitionHandler,
            register: (from: Roles, messageHandler: MessageHandler) => void
        ) {
            const messageHandler = (message: any) => {
                const parsedMessage = JSON.parse(message) as Message.S9;
                switch (parsedMessage.label) {
                    case Labels.S9.TwoBids: {
                        const successor = this.handler[parsedMessage.label](...parsedMessage.payload);
                        if (successor instanceof Promise) {
                            successor.then(next).catch(console.error);
                        } else {
                            next(successor);
                        }
                        return;
                    }

                    // default: {
                    //   throw new Error(`Unexpected receive: ${parsedMessage.label}`);
                    // }
                }
            }

            register(Roles.Bob, messageHandler);
        }

    }
    export class S8 extends Terminal {

        constructor(private handler: Handler.S8) {
            super();
        }

    }

}

// =============
// Runtime types
// =============

export type EfsmTransitionHandler = (implementation: Implementation.Type) => void
export type MessageHandler = (message: any) => void