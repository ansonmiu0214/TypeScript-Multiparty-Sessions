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
 * * __OK__(number)
 * * __No__()
 */
export default abstract class S30<ComponentState = {}> extends React.Component<Props, ComponentState>
{

    protected OK: SendComponentFactory<[number]>;
    protected No: SendComponentFactory<[]>;

    constructor(props: Props) {
        super(props);
        this.OK = props.factory<[number]>(
            Roles.Peers.A, 'OK', TerminalState.S28
        );
        this.No = props.factory<[]>(
            Roles.Peers.A, 'No', TerminalState.S28
        );

    }
}