import React from 'react';

import { ReceiveState, SendState, TerminalState, Roles } from './EFSM';
import { SendComponentFactory, SendComponentFactoryFactory } from './Session';



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
        this.Add = props.factory<[number, number]>(Roles.Svr, 'Add', ReceiveState.S63);
        this.Mult = props.factory<[number, number]>(Roles.Svr, 'Mult', ReceiveState.S64);
        this.Double = props.factory<[number]>(Roles.Svr, 'Double', ReceiveState.S65);
        this.Quit = props.factory<[]>(Roles.Svr, 'Quit', ReceiveState.S66);

    }
}