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

export default abstract class S19<
    _P = {},
    _S = {},
    _SS = any
    > extends React.Component<
    P & _P,
    _S,
    _SS
    > {

    protected ok: SendComponentFactory<[string]>;
    protected quit: SendComponentFactory<[]>;

    constructor(props: P & _P) {
        super(props);
        this.ok = props.factory<[string]>(Roles.Peers.S, 'ok', ReceiveState.S20);
        this.quit = props.factory<[]>(Roles.Peers.S, 'quit', TerminalState.S17);

    }
}