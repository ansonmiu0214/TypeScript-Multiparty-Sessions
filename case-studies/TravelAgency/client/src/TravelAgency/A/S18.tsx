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

import { Credentials as Cred } from "../../Models";


// ===============
// Component types
// ===============

type Props = {
    factory: SendComponentFactoryFactory
}

/**
 * __Sends to  S.__ Possible messages:
 *
 * * __Reject__()
 */
export default abstract class S18<ComponentState = {}> extends React.Component<Props, ComponentState>
{

    protected Reject: SendComponentFactory<[]>;

    constructor(props: Props) {
        super(props);
        this.Reject = props.factory<[]>(
            Roles.Peers.S, 'Reject', TerminalState.S12
        );

    }
}