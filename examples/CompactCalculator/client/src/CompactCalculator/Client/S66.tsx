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



type P = {
    register: (role: Roles.Peers, handle: ReceiveHandler) => void
}

enum Labels {
    Terminate = 'Terminate',
}

type TerminateMessage = {
    label: Labels.Terminate,
    payload: [],
};


type Message = | TerminateMessage

export default abstract class S66<
    _P = {},
    _S = {},
    _SS = any
    > extends React.Component<
    _P & P,
    _S,
    _SS
    >
{

    constructor(props: _P & P) {
        super(props);
        this.props.register(Roles.Peers.Svr, this.handle.bind(this));
    }

    handle(message: any): MaybePromise<State> {
        const parsedMessage = JSON.parse(message) as Message;
        switch (parsedMessage.label) {
            case Labels.Terminate: {
                const thunk = () => TerminalState.S62;

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