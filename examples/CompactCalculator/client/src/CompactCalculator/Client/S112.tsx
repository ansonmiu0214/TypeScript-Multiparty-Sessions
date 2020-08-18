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



// ==================
// Message structures
// ==================

enum Labels {
    Terminate = 'Terminate',
}

interface TerminateMessage {
    label: Labels.Terminate,
    payload: [],
};


type Message = | TerminateMessage

// ===============
// Component types
// ===============

type Props = {
    register: (role: Roles.Peers, handle: ReceiveHandler) => void
};

export default abstract class S112<ComponentState = {}> extends React.Component<Props, ComponentState>
{

    componentDidMount() {
        this.props.register(Roles.Peers.Svr, this.handle.bind(this));
    }

    handle(message: any): MaybePromise<State> {
        const parsedMessage = JSON.parse(message) as Message;
        switch (parsedMessage.label) {
            case Labels.Terminate: {
                const thunk = () => TerminalState.S108;

                const continuation = this.Terminate(...parsedMessage.payload);
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

    abstract Terminate(): MaybePromise<void>;
}