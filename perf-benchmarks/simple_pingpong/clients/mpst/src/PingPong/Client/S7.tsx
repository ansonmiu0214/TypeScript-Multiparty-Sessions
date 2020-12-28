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



// ==================
// Message structures
// ==================

enum Labels {
    PONG = 'PONG', BYE = 'BYE',
}

interface PONGMessage {
    label: Labels.PONG,
    payload: [number],
};
interface BYEMessage {
    label: Labels.BYE,
    payload: [number],
};


type Message = | PONGMessage | BYEMessage

// ===============
// Component types
// ===============

type Props = {
    register: (role: Roles.Peers, handle: ReceiveHandler) => void
};

/**
 * __Receives from Svr.__ Possible messages:
 *
 * * __PONG__(number)
 * * __BYE__(number)
 */
export default abstract class S7<ComponentState = {}> extends React.Component<Props, ComponentState>
{

    componentDidMount() {
        this.props.register(Roles.Peers.Svr, this.handle.bind(this));
    }

    handle(message: any): MaybePromise<State> {
        const parsedMessage = JSON.parse(message) as Message;
        switch (parsedMessage.label) {
            case Labels.PONG: {
                const thunk = () => SendState.S5;

                const continuation = this.PONG(...parsedMessage.payload);
                if (continuation instanceof Promise) {
                    return new Promise((resolve, reject) => {
                        continuation.then(() => {
                            resolve(thunk());
                        }).catch(reject);
                    })
                } else {
                    return thunk();
                }
            } case Labels.BYE: {
                const thunk = () => TerminalState.S6;

                const continuation = this.BYE(...parsedMessage.payload);
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

    abstract PONG(payload1: number, ): MaybePromise<void>;
    abstract BYE(payload1: number, ): MaybePromise<void>;

}