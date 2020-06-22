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

import { Credential as Cred } from "./Payment";


// ===============
// Component types
// ===============

type Props = {
    factory: SendComponentFactoryFactory
}

export default abstract class S9<ComponentState = {}> extends React.Component<Props, ComponentState>
{

    protected Confirm: SendComponentFactory<[Cred]>;
    protected Reject: SendComponentFactory<[]>;

    constructor(props: Props) {
        super(props);
        this.Confirm = props.factory<[Cred]>(
            Roles.Peers.Server, 'Confirm', TerminalState.S7
        );
        this.Reject = props.factory<[]>(
            Roles.Peers.Server, 'Reject', TerminalState.S7
        );

    }
}