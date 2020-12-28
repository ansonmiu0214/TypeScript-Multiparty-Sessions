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
 * * __Quote__(number)
 */
export default abstract class S15<ComponentState = {}> extends React.Component<Props, ComponentState>
{

    protected Quote: SendComponentFactory<[number]>;

    constructor(props: Props) {
        super(props);
        this.Quote = props.factory<[number]>(
            Roles.Peers.B, 'Quote', ReceiveState.S16
        );

    }
}