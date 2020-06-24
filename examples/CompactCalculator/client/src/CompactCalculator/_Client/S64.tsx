import React from 'react';

import { State, ReceiveState, SendState, TerminalState } from './EFSM';
import { MaybePromise, ReceiveHandler } from './Session';



type P = {
    register: (handle: ReceiveHandler) => void
}

enum Labels {
    Res = 'Res',
}

type ResMessage = {
    label: Labels.Res,
    payload: [number],
};


type Message = | ResMessage

export default abstract class S64<
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
            case Labels.Res: {
                const thunk = () => SendState.S61;

                const continuation = this.Res(...parsedMessage.payload);
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

    abstract Res(payload1: number, ): MaybePromise<void>;

}