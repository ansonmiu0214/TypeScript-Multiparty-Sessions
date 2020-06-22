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

export default abstract class S6<ComponentState = {}> extends React.Component<Props, ComponentState>
{

    protected Destination: SendComponentFactory<[string]>;

    constructor(props: Props) {
        super(props);
        this.Destination = props.factory<[string]>(
            Roles.Peers.Server, 'Destination', ReceiveState.S8
        );

    }
}