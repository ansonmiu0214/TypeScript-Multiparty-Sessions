import React from 'react';

import { ReceiveState, SendState, TerminalState, Roles } from './EFSM';
import { SendComponentFactory, SendComponentFactoryFactory } from './Session';



type P = {
    factory: SendComponentFactoryFactory
}

export default abstract class S26<
    _P = {},
    _S = {},
    _SS = any
    > extends React.Component<
    P & _P,
    _S,
    _SS
    > {

    protected TwoBids: SendComponentFactory<[number, number]>;

    constructor(props: P & _P) {
        super(props);
        this.TwoBids = props.factory<[number, number]>(Roles.Svr, 'TwoBids', ReceiveState.S28);

    }
}