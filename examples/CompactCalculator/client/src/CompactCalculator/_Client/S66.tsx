import React from 'react';

import { State, ReceiveState, SendState, TerminalState } from './EFSM';
import { MaybePromise, ReceiveHandler } from './Session';



type P = {
    register: (handle: ReceiveHandler) => void
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

    componentDidMount() {
        this.props.register(this.handle.bind(this));
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