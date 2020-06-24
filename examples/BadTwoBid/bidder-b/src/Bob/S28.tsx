import React from 'react';

import { State, ReceiveState, SendState, TerminalState } from './EFSM';
import { MaybePromise, ReceiveHandler } from './Session';



type P = {
    register: (handle: ReceiveHandler) => void
}

enum Labels {
    Lose = 'Lose', Win = 'Win',
}

type LoseMessage = {
    label: Labels.Lose,
    payload: [],
};
type WinMessage = {
    label: Labels.Win,
    payload: [],
};


type Message = | LoseMessage | WinMessage

export default abstract class S28<
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
            case Labels.Lose: {
                const thunk = () => TerminalState.S27;

                const continuation = this.Lose(...parsedMessage.payload);
                if (continuation instanceof Promise) {
                    return new Promise((resolve, reject) => {
                        continuation.then(() => {
                            resolve(thunk());
                        }).catch(reject);
                    })
                } else {
                    return thunk();
                }
            } case Labels.Win: {
                const thunk = () => TerminalState.S27;

                const continuation = this.Win(...parsedMessage.payload);
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

    abstract Lose(): MaybePromise<void>; abstract Win(): MaybePromise<void>;

}