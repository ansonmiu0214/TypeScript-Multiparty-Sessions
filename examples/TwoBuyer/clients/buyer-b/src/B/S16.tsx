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
    quote = 'quote',
}

type quoteMessage = {
    label: Labels.quote,
    payload: [number],
};


type Message = | quoteMessage

export default abstract class S16<
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
            case Labels.quote: {
                const thunk = () => ReceiveState.S18;

                const continuation = this.quote(...parsedMessage.payload);
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

    abstract quote(payload1: number, ): MaybePromise<unknown>;
}