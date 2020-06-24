import React from 'react';

import { ReceiveState, SendState, TerminalState, Roles } from './EFSM';
import { SendComponentFactory, SendComponentFactoryFactory } from './Session';



type P = {
    factory: SendComponentFactoryFactory
}

export default abstract class S18<
    _P = {},
    _S = {},
    _SS = any
    > extends React.Component<
    P & _P,
    _S,
    _SS
    > {

    protected Bid: SendComponentFactory<[number]>;

    constructor(props: P & _P) {
        super(props);
        this.Bid = props.factory<[number]>(Roles.Svr, 'Bid', ReceiveState.S20);

    }
}