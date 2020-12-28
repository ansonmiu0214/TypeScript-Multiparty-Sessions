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

import { Location } from "../../Models";
import { Config } from "../../Models";


// ===============
// Component types
// ===============

type Props = {
    factory: SendComponentFactoryFactory
}

/**
 * __Sends to  Svr.__ Possible messages:
 *
 * * __Attack__(Location)
 */
export default abstract class S130<ComponentState = {}> extends React.Component<Props, ComponentState>
{

    protected Attack: SendComponentFactory<[Location]>;

    constructor(props: Props) {
        super(props);
        this.Attack = props.factory<[Location]>(
            Roles.Peers.Svr, 'Attack', ReceiveState.S131
        );

    }
}