import React from "react";

// ===============
// Component types
// ===============

type Props = {
    terminate: () => void,
};

export default abstract class S108<ComponentState = {}> extends React.Component<Props, ComponentState> {

    componentDidMount() {
        this.props.terminate();
    }

}