import React from 'react';

import * as Roles from './Roles';
import {
    State,
    ReceiveState,
    SendState,
    TerminalState,
} from './EFSM';

import {
    MaybePromise,
} from './Types';

import {
    ReceiveHandler
} from './Session';

import { Credentials as Cred } from "../../Models";


// ==================
// Message structures
// ==================

enum Labels {
    Full = 'Full', Quote = 'Quote',
}

interface FullMessage {
    label: Labels.Full,
    payload: [],
};
interface QuoteMessage {
    label: Labels.Quote,
    payload: [number],
};


type Message = | FullMessage | QuoteMessage

// ===============
// Component types
// ===============

type Props = {
    register: (role: Roles.Peers, handle: ReceiveHandler) => void
};

/**
 * __Receives from A.__ Possible messages:
 *
 * * __Full__()
 * * __Quote__(number)
 */
export default abstract class S29<ComponentState = {}> extends React.Component<Props, ComponentState>
{

    componentDidMount() {
        this.props.register(Roles.Peers.A, this.handle.bind(this));
    }

    handle(message: any): MaybePromise<State> {
        const parsedMessage = JSON.parse(message) as Message;
        switch (parsedMessage.label) {
            case Labels.Full: {
                const thunk = () => SendState.S27;

                const continuation = this.Full(...parsedMessage.payload);
                if (continuation instanceof Promise) {
                    return new Promise((resolve, reject) => {
                        continuation.then(() => {
                            resolve(thunk());
                        }).catch(reject);
                    })
                } else {
                    return thunk();
                }
            } case Labels.Quote: {
                const thunk = () => SendState.S30;

                const continuation = this.Quote(...parsedMessage.payload);
                if (continuation instanceof Promise) {
                    return new Promise((resolve, reject) => {
                        continuation.then(() => {
                            resolve(thunk());
                        }).catch(reject);
                    })
                } else {
                    return thunk();
                }
            }
        }
    }

    abstract Full(): MaybePromise<void>;
    abstract Quote(payload1: number,): MaybePromise<void>;

}