import React from "react";

type P = {
    terminate: () => void,
}

export default abstract class S62<
    _P = {},
    _S = {},
    _SS = any
    > extends React.Component<
    _P & P,
    _S,
    _SS
    > {

    constructor(props: _P & P) {
        super(props);
        this.props.terminate();
    }

}