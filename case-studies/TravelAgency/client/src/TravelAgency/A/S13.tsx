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
 * * __Query__(string)
 */
export default abstract class S13<ComponentState = {}> extends React.Component<Props, ComponentState>
{

    protected Query: SendComponentFactory<[string]>;

    constructor(props: Props) {
        super(props);
        this.Query = props.factory<[string]>(
            Roles.Peers.S, 'Query', ReceiveState.S14
        );

    }
}