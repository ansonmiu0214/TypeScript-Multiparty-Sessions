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

/**
 * __Sends to  Svr.__ Possible messages:
 *
 * * __PING__(number)
 */
export default abstract class S5<ComponentState = {}> extends React.Component<Props, ComponentState>
{

    protected PING: SendComponentFactory<[number]>;

    constructor(props: Props) {
        super(props);
        this.PING = props.factory<[number]>(
            Roles.Peers.Svr, 'PING', ReceiveState.S7
        );

    }
}