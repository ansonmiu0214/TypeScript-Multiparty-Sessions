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

import { Coordinate as Point } from "../../GameTypes";


// ===============
// Component types
// ===============

type Props = {
    factory: SendComponentFactoryFactory
}

/**
 * __Sends to  Svr.__ Possible messages:
 *
 * * __Pos__(Point)
 */
export default abstract class S44<ComponentState = {}> extends React.Component<Props, ComponentState>
{

    protected Pos: SendComponentFactory<[Point]>;

    constructor(props: Props) {
        super(props);
        this.Pos = props.factory<[Point]>(
            Roles.Peers.Svr, 'Pos', ReceiveState.S45
        );

    }
}