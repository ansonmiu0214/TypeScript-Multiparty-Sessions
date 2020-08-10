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



// ===============
// Component types
// ===============

type Props = {
    factory: SendComponentFactoryFactory
}

export default abstract class S107<ComponentState = {}> extends React.Component<Props, ComponentState>
{

    protected Add: SendComponentFactory<[number, number]>;
    protected Mult: SendComponentFactory<[number, number]>;
    protected Double: SendComponentFactory<[number]>;
    protected Quit: SendComponentFactory<[]>;

    constructor(props: Props) {
        super(props);
        this.Add = props.factory<[number, number]>(
            Roles.Peers.Svr, 'Add', ReceiveState.S109
        );
        this.Mult = props.factory<[number, number]>(
            Roles.Peers.Svr, 'Mult', ReceiveState.S110
        );
        this.Double = props.factory<[number]>(
            Roles.Peers.Svr, 'Double', ReceiveState.S111
        );
        this.Quit = props.factory<[]>(
            Roles.Peers.Svr, 'Quit', ReceiveState.S112
        );

    }
}