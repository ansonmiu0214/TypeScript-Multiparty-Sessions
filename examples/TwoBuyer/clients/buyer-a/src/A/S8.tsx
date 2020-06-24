import React from 'react';

import * as Roles from './Roles';

import {
    ReceiveState,
    SendState,
    TerminalState
} from './EFSM';

import {
    SendComponentFactory,
    SendComponentFactoryFactory
} from './Session';



type P = {
    factory: SendComponentFactoryFactory
}

export default abstract class S8<
    _P = {},
    _S = {},
    _SS = any
    > extends React.Component<
    P & _P,
    _S,
    _SS
    > {

    protected quoteByTwo: SendComponentFactory<[number]>;

    constructor(props: P & _P) {
        super(props);
        this.quoteByTwo = props.factory<[number]>(Roles.Peers.B, 'quoteByTwo', TerminalState.S6);

    }
}