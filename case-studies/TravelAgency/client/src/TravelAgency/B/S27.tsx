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
 * __Sends to  A.__ Possible messages:
 *
 * * __Suggest__(string)
 */
export default abstract class S27<ComponentState = {}> extends React.Component<Props, ComponentState>
{

    protected Suggest: SendComponentFactory<[string]>;

    constructor(props: Props) {
        super(props);
        this.Suggest = props.factory<[string]>(
            Roles.Peers.A, 'Suggest', ReceiveState.S29
        );

    }
}