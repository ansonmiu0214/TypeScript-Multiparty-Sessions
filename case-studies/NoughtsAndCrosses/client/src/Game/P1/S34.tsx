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

import { Coordinate as Point } from "../../GameTypes";


// ==================
// Message structures
// ==================

enum Labels {
    Update = 'Update', Lose = 'Lose', Draw = 'Draw',
}

interface UpdateMessage {
    label: Labels.Update,
    payload: [Point],
};
interface LoseMessage {
    label: Labels.Lose,
    payload: [Point],
};
interface DrawMessage {
    label: Labels.Draw,
    payload: [Point],
};


type Message = | UpdateMessage | LoseMessage | DrawMessage

// ===============
// Component types
// ===============

type Props = {
    register: (role: Roles.Peers, handle: ReceiveHandler) => void
};

/**
 * __Receives from Svr.__ Possible messages:
 *
 * * __Update__(Point)
 * * __Lose__(Point)
 * * __Draw__(Point)
 */
export default abstract class S34<ComponentState = {}> extends React.Component<Props, ComponentState>
{

    componentDidMount() {
        this.props.register(Roles.Peers.Svr, this.handle.bind(this));
    }

    handle(message: any): MaybePromise<State> {
        const parsedMessage = JSON.parse(message) as Message;
        switch (parsedMessage.label) {
            case Labels.Update: {
                const thunk = () => SendState.S31;

                const continuation = this.Update(...parsedMessage.payload);
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
                const thunk = () => TerminalState.S32;

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
            } case Labels.Draw: {
                const thunk = () => TerminalState.S32;

                const continuation = this.Draw(...parsedMessage.payload);
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

    abstract Update(payload1: Point,): MaybePromise<void>;
    abstract Lose(payload1: Point,): MaybePromise<void>;
    abstract Draw(payload1: Point,): MaybePromise<void>;

}