import React from 'react';

import { State, ReceiveState, SendState, TerminalState } from './EFSM';
import { MaybePromise, ReceiveHandler } from './Session';



type P = {
    register: (handle: ReceiveHandler) => void
}

enum Labels {
    Win = 'Win', Lose = 'Lose',
}

type WinMessage = {
    label: Labels.Win,
    payload: [],
};
type LoseMessage = {
    label: Labels.Lose,
    payload: [],
};


type Message = | WinMessage | LoseMessage

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
        this.props.register(this.handle.bind(this));
    }

    handle(message: any): MaybePromise<State> {
        const parsedMessage = JSON.parse(message) as Message;
        switch (parsedMessage.label) {
            case Labels.Win: {
                const thunk = () => TerminalState.S19;

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
            } case Labels.Lose: {
                const thunk = () => TerminalState.S19;

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
            }
        }
    }

    abstract Win(): MaybePromise<void>; abstract Lose(): MaybePromise<void>;

}