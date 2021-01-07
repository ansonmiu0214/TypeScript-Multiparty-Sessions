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
 * * __Confirm__(Cred)
 */
export default abstract class S17<ComponentState = {}> extends React.Component<Props, ComponentState>
{

    protected Confirm: SendComponentFactory<[Cred]>;

    constructor(props: Props) {
        super(props);
        this.Confirm = props.factory<[Cred]>(
            Roles.Peers.S, 'Confirm', TerminalState.S12
        );

    }
}