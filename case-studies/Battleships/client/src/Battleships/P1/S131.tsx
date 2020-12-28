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

import { Location } from "../../Models";
import { Config } from "../../Models";


// ==================
// Message structures
// ==================

enum Labels {
    Hit = 'Hit', Miss = 'Miss', Sunk = 'Sunk', Winner = 'Winner',
}

interface HitMessage {
    label: Labels.Hit,
    payload: [Location],
};
interface MissMessage {
    label: Labels.Miss,
    payload: [Location],
};
interface SunkMessage {
    label: Labels.Sunk,
    payload: [Location],
};
interface WinnerMessage {
    label: Labels.Winner,
    payload: [Location],
};


type Message = | HitMessage | MissMessage | SunkMessage | WinnerMessage

// ===============
// Component types
// ===============

type Props = {
    register: (role: Roles.Peers, handle: ReceiveHandler) => void
};

/**
 * __Receives from Svr.__ Possible messages:
 *
 * * __Hit__(Location)
 * * __Miss__(Location)
 * * __Sunk__(Location)
 * * __Winner__(Location)
 */
export default abstract class S131<ComponentState = {}> extends React.Component<Props, ComponentState>
{

    componentDidMount() {
        this.props.register(Roles.Peers.Svr, this.handle.bind(this));
    }

    handle(message: any): MaybePromise<State> {
        const parsedMessage = JSON.parse(message) as Message;
        switch (parsedMessage.label) {
            case Labels.Hit: {
                const thunk = () => ReceiveState.S132;

                const continuation = this.Hit(...parsedMessage.payload);
                if (continuation instanceof Promise) {
                    return new Promise((resolve, reject) => {
                        continuation.then(() => {
                            resolve(thunk());
                        }).catch(reject);
                    })
                } else {
                    return thunk();
                }
            } case Labels.Miss: {
                const thunk = () => ReceiveState.S132;

                const continuation = this.Miss(...parsedMessage.payload);
                if (continuation instanceof Promise) {
                    return new Promise((resolve, reject) => {
                        continuation.then(() => {
                            resolve(thunk());
                        }).catch(reject);
                    })
                } else {
                    return thunk();
                }
            } case Labels.Sunk: {
                const thunk = () => ReceiveState.S132;

                const continuation = this.Sunk(...parsedMessage.payload);
                if (continuation instanceof Promise) {
                    return new Promise((resolve, reject) => {
                        continuation.then(() => {
                            resolve(thunk());
                        }).catch(reject);
                    })
                } else {
                    return thunk();
                }
            } case Labels.Winner: {
                const thunk = () => TerminalState.S129;

                const continuation = this.Winner(...parsedMessage.payload);
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

    abstract Hit(payload1: Location, ): MaybePromise<void>; abstract Miss(payload1: Location, ): MaybePromise<void>; abstract Sunk(payload1: Location, ): MaybePromise<void>; abstract Winner(payload1: Location, ): MaybePromise<void>;
}