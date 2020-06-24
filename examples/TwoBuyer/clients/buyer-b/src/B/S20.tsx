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
    date = 'date',
}

type dateMessage = {
    label: Labels.date,
    payload: [string],
};


type Message = | dateMessage

export default abstract class S20<
    _P = {},
    _S = {},
    _SS = any
    > extends React.Component<
    _P & P,
    _S,
    _SS
    >
{

    componentDidMount() {
        this.props.register(Roles.Peers.S, this.handle.bind(this));
    }

    handle(message: any): MaybePromise<State> {
        const parsedMessage = JSON.parse(message) as Message;
        switch (parsedMessage.label) {
            case Labels.date: {
                const thunk = () => TerminalState.S17;

                const continuation = this.date(...parsedMessage.payload);
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

    abstract date(payload1: string, ): MaybePromise<unknown>;
}