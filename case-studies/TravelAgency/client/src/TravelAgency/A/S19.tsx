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
 * __Sends to  B.__ Possible messages:
 *
 * * __Full__()
 */
export default abstract class S19<ComponentState = {}> extends React.Component<Props, ComponentState>
{

    protected Full: SendComponentFactory<[]>;

    constructor(props: Props) {
        super(props);
        this.Full = props.factory<[]>(
            Roles.Peers.B, 'Full', ReceiveState.S11
        );

    }
}