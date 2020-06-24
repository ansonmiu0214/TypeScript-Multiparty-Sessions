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

export default abstract class S5<
    _P = {},
    _S = {},
    _SS = any
    > extends React.Component<
    P & _P,
    _S,
    _SS
    > {

    protected title: SendComponentFactory<[string]>;

    constructor(props: P & _P) {
        super(props);
        this.title = props.factory<[string]>(Roles.Peers.S, 'title', ReceiveState.S7);

    }
}