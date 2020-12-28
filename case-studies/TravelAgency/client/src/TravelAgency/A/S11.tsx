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

import { Credentials as Cred } from "../../Models";


// ==================
// Message structures
// ==================

enum Labels {
    Suggest = 'Suggest',
}

interface SuggestMessage {
    label: Labels.Suggest,
    payload: [string],
};


type Message = | SuggestMessage

// ===============
// Component types
// ===============

type Props = {
    register: (role: Roles.Peers, handle: ReceiveHandler) => void
};

/**
 * __Receives from B.__ Possible messages:
 *
 * * __Suggest__(string)
 */
export default abstract class S11<ComponentState = {}> extends React.Component<Props, ComponentState>
{

    componentDidMount() {
        this.props.register(Roles.Peers.B, this.handle.bind(this));
    }

    handle(message: any): MaybePromise<State> {
        const parsedMessage = JSON.parse(message) as Message;
        switch (parsedMessage.label) {
            case Labels.Suggest: {
                const thunk = () => SendState.S13;

                const continuation = this.Suggest(...parsedMessage.payload);
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

    abstract Suggest(payload1: string,): MaybePromise<void>;

}