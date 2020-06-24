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



//type P = 

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
    _P & {
        register: (role: Roles.Peers, handle: ReceiveHandler) => void
    },
    _S,
    _SS
    >
{

    constructor(props: _P & {
        register: (role: Roles.Peers, handle: ReceiveHandler) => void
    }) {
        super(props);
    }
    
    componentDidMount() {
        this.props.register(Roles.Peers.Svr, this.handle.bind(this));
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

    Res(payload1: number, ): MaybePromise<void> {}

}

