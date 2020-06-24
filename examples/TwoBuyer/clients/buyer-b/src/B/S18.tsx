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
    quoteByTwo = 'quoteByTwo',
}

type quoteByTwoMessage = {
    label: Labels.quoteByTwo,
    payload: [number],
};


type Message = | quoteByTwoMessage

export default abstract class S18<
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
        this.props.register(Roles.Peers.A, this.handle.bind(this));
    }

    handle(message: any): MaybePromise<State> {
        const parsedMessage = JSON.parse(message) as Message;
        switch (parsedMessage.label) {
            case Labels.quoteByTwo: {
                const thunk = () => SendState.S19;

                const continuation = this.quoteByTwo(...parsedMessage.payload);
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

    abstract quoteByTwo(payload1: number, ): MaybePromise<unknown>;
}