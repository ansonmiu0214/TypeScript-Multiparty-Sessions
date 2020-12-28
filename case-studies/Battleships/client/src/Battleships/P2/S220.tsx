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

import { Config } from "../../Models";
import { Location } from "../../Models";


// ===============
// Component types
// ===============

type Props = {
    factory: SendComponentFactoryFactory
}

/**
 * __Sends to  Svr.__ Possible messages:
 *
 * * __Init__(Config)
 */
export default abstract class S220<ComponentState = {}> extends React.Component<Props, ComponentState>
{

    protected Init: SendComponentFactory<[Config]>;

    constructor(props: Props) {
        super(props);
        this.Init = props.factory<[Config]>(
            Roles.Peers.Svr, 'Init', ReceiveState.S222
        );

    }
}