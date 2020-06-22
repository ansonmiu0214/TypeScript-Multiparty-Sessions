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

import { Credential as Cred } from "./Payment";


// ==================
// Message structures
// ==================

enum Labels {
    Available = 'Available', Full = 'Full',
}

interface AvailableMessage {
    label: Labels.Available,
    payload: [number],
};
interface FullMessage {
    label: Labels.Full,
    payload: [],
};


type Message = | AvailableMessage | FullMessage

// ===============
// Component types
// ===============

type Props = {
    register: (role: Roles.Peers, handle: ReceiveHandler) => void
};

export default abstract class S8<ComponentState = {}> extends React.Component<Props, ComponentState>
{

    componentDidMount() {
        this.props.register(Roles.Peers.Server, this.handle.bind(this));
    }

    handle(message: any): MaybePromise<State> {
        const parsedMessage = JSON.parse(message) as Message;
        switch (parsedMessage.label) {
            case Labels.Available: {
                const thunk = () => SendState.S9;

                const continuation = this.Available(...parsedMessage.payload);
                if (continuation instanceof Promise) {
                    return new Promise((resolve, reject) => {
                        continuation.then(() => {
                            resolve(thunk());
                        }).catch(reject);
                    })
                } else {
                    return thunk();
                }
            } case Labels.Full: {
                const thunk = () => SendState.S6;

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
            }
        }
    }

    abstract Available(payload1: number, ): MaybePromise<void>; abstract Full(): MaybePromise<void>;
}