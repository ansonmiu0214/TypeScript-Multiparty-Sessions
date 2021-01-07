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
    OK = 'OK', No = 'No',
}

interface OKMessage {
    label: Labels.OK,
    payload: [number],
};
interface NoMessage {
    label: Labels.No,
    payload: [],
};


type Message = | OKMessage | NoMessage

// ===============
// Component types
// ===============

type Props = {
    register: (role: Roles.Peers, handle: ReceiveHandler) => void
};

/**
 * __Receives from B.__ Possible messages:
 *
 * * __OK__(number)
 * * __No__()
 */
export default abstract class S16<ComponentState = {}> extends React.Component<Props, ComponentState>
{

    componentDidMount() {
        this.props.register(Roles.Peers.B, this.handle.bind(this));
    }

    handle(message: any): MaybePromise<State> {
        const parsedMessage = JSON.parse(message) as Message;
        switch (parsedMessage.label) {
            case Labels.OK: {
                const thunk = () => SendState.S17;

                const continuation = this.OK(...parsedMessage.payload);
                if (continuation instanceof Promise) {
                    return new Promise((resolve, reject) => {
                        continuation.then(() => {
                            resolve(thunk());
                        }).catch(reject);
                    })
                } else {
                    return thunk();
                }
            } case Labels.No: {
                const thunk = () => SendState.S18;

                const continuation = this.No(...parsedMessage.payload);
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

    abstract OK(payload1: number,): MaybePromise<void>;
    abstract No(): MaybePromise<void>;

}