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

export default abstract class S61<
    _P = {},
    _S = {},
    _SS = any
    > extends React.Component<
    P & _P,
    _S,
    _SS
    > {

    protected Add: SendComponentFactory<[number, number]>;
    protected Mult: SendComponentFactory<[number, number]>;
    protected Double: SendComponentFactory<[number]>;
    protected Quit: SendComponentFactory<[]>;

    constructor(props: P & _P) {
        super(props);
        this.Add = props.factory<[number, number]>(Roles.Peers.Svr, 'Add', ReceiveState.S63);
        this.Mult = props.factory<[number, number]>(Roles.Peers.Svr, 'Mult', ReceiveState.S64);
        this.Double = props.factory<[number]>(Roles.Peers.Svr, 'Double', ReceiveState.S65);
        this.Quit = props.factory<[]>(Roles.Peers.Svr, 'Quit', ReceiveState.S66);

    }
}