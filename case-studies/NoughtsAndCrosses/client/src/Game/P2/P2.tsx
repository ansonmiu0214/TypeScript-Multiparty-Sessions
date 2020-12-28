// Runtime.tsx
import React from 'react';

import * as Cancellation from './Cancellation';
import * as Roles from './Roles';
import * as Message from './Message';
import {
    State,
    ReceiveState,
    isSendState,
    isReceiveState,
    isTerminalState,
} from './EFSM';

import {
    ReceiveHandler,
    SendComponentFactory,
} from './Session';

import {
    Constructor,
    DOMEvents,
    EventHandler,
    FunctionArguments,
} from './Types';

import S44 from './S44';
import S42 from './S42';
import S45 from './S45';
import S43 from './S43';

type RoleToMessageQueue = Roles.PeersToMapped<any[]>;
type RoleToHandlerQueue = Roles.PeersToMapped<ReceiveHandler[]>;

// ==============
// Component type
// ==============

type Props = {
    endpoint: string,
    states: {
        S44: Constructor<S44>,
        S42: Constructor<S42>,
        S45: Constructor<S45>,
        S43: Constructor<S43>,

    },
    waiting: React.ReactNode,
    connectFailed: React.ReactNode,
    cancellation: (role: Roles.All, reason?: any) => React.ReactNode,
};

type Transport = {
    ws: WebSocket
};

type ComponentState = {
    elem: React.ReactNode
};

export default class Session extends React.Component<Props, Partial<Transport>> {

    constructor(props: Props) {
        super(props);
        this.state = {
            ws: undefined
        };
    }

    componentDidMount() {
        // Set up WebSocket connection
        this.setState({
            ws: new WebSocket(this.props.endpoint),
        });
    }

    render() {
        const { ws } = this.state;
        return ws === undefined
            ? this.props.waiting
            : <P2 ws={ws} {...this.props} />;
    }

}

class P2 extends React.Component<Props & Transport, ComponentState> {

    private messageQueue: RoleToMessageQueue
    private handlerQueue: RoleToHandlerQueue

    constructor(props: Props & Transport) {
        super(props);

        this.state = {
            elem: props.waiting,
        };

        // Set up message and handler queues
        this.messageQueue = {
            [Roles.Peers.Svr]: [], [Roles.Peers.P1]: [],
        };
        this.handlerQueue = {
            [Roles.Peers.Svr]: [], [Roles.Peers.P1]: [],
        };

        // Bind functions
        this.onReceiveInit = this.onReceiveInit.bind(this);
        this.onCloseInit = this.onCloseInit.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onReceiveMessage = this.onReceiveMessage.bind(this);
        this.buildSendElement = this.buildSendElement.bind(this);
        this.registerReceiveHandler = this.registerReceiveHandler.bind(this);
        this.advance = this.advance.bind(this);
        this.cancel = this.cancel.bind(this);
        this.terminate = this.terminate.bind(this);
    }

    componentDidMount() {
        const { ws } = this.props;
        ws.onmessage = this.onReceiveInit;

        // Send connection message
        ws.onopen = () => {
            ws.send(JSON.stringify(Message.ConnectRequest));
        };

        // Handle error
        ws.onerror = (event) => {
            this.setState({ elem: this.props.connectFailed });
        }

        ws.onclose = this.onCloseInit;
    }

    // ===============
    // Session joining
    // ===============

    private onReceiveInit(message: MessageEvent) {
        const { ws } = this.props;
        ws.onmessage = this.onReceiveMessage;
        ws.onclose = this.onClose;

        this.advance(ReceiveState.S42);

    }

    private onCloseInit({ code, wasClean, reason }: CloseEvent) {
        if (!wasClean) {
            // Not closed properly
            this.setState({ elem: this.props.connectFailed });
            return;
        }

        switch (code) {
            case Cancellation.Receive.ROLE_OCCUPIED: {
                this.processCancellation(Roles.Self, 'role occupied');
                return;
            }
            default: {
                // Unsupported code
                this.processCancellation(Roles.Server, reason);
                return;
            }
        }
    }

    // ===============
    // EFSM operations
    // ===============

    private advance(state: State) {
        if (isSendState(state)) {
            const View = this.props.states[state];
            this.setState({
                elem: <View factory={this.buildSendElement} />
            });
        } else if (isReceiveState(state)) {
            const View = this.props.states[state];
            this.setState({
                elem: <View register={this.registerReceiveHandler} />
            });
        } else if (isTerminalState(state)) {
            const View = this.props.states[state];
            this.setState({
                elem: <View terminate={this.terminate} />
            });
        }
    }

    private buildSendElement<T>(role: Roles.Peers, label: string, successor: State): SendComponentFactory<T> {
        return <K extends keyof DOMEvents>(eventLabel: K, handler: EventHandler<T, K>) => {

            // Boolean flag since send(...) can be async;
            // must not be triggered twice.
            let used = false;

            const send = (payload: T) => this.sendMessage(role, label, payload, successor);
            const cancel = (error?: any) => this.cancel(error);

            return class extends React.Component {
                render() {
                    const props = {
                        [eventLabel as string]: (event: FunctionArguments<DOMEvents[K]>) => {
                            if (used) {
                                return;
                            }

                            used = true;

                            try {
                                const result = handler(event);
                                if (result instanceof Promise) {
                                    result.then(send).catch(cancel);
                                } else {
                                    send(result);
                                }
                            } catch (error) {
                                cancel(error);
                            }
                        }
                    };

                    return React.Children.map(this.props.children, child => (
                        React.cloneElement(child as React.ReactElement, props)
                    ));
                }
            }
        }
    }

    private registerReceiveHandler(role: Roles.Peers, handle: ReceiveHandler) {
        const message = this.messageQueue[role].shift();
        if (message !== undefined) {
            // Message received already -- process.
            try {
                const continuation = handle(message);
                if (continuation instanceof Promise) {
                    continuation.then(this.advance).catch(this.cancel);
                } else {
                    this.advance(continuation);
                }
            } catch (error) {
                this.cancel(error);
            }
        } else {
            // No message received -- `queue' handler.
            this.handlerQueue[role].push(handle);
        }
    }

    // ===============
    // Channel methods
    // ===============

    private sendMessage(role: Roles.Peers, label: string, payload: any, successor: State) {
        this.props.ws.send(JSON.stringify(Message.toChannel(role, label, payload)));
        this.advance(successor);
    }

    private onReceiveMessage({ data }: MessageEvent) {
        const message = JSON.parse(data) as Message.Channel;
        const handler = this.handlerQueue[message.role].shift();
        if (handler !== undefined) {
            // Handler registered -- process.
            try {
                const continuation = handler(data);
                if (continuation instanceof Promise) {
                    continuation.then(this.advance).catch(this.cancel);
                } else {
                    this.advance(continuation);
                }
            } catch (error) {
                this.cancel(error);
            }
        } else {
            // No handler registered -- `queue' message.
            this.messageQueue[message.role].push(message);
        }
    }
    private terminate() {
        this.props.ws.close(Cancellation.Emit.NORMAL);
    }

    // ============
    // Cancellation
    // ============

    private onClose({ code, reason }: CloseEvent) {
        switch (code) {
            case Cancellation.Receive.NORMAL: {
                // Normal, clean cancellation
                return;
            }
            case Cancellation.Receive.SERVER_DISCONNECT: {
                // Server role disconnected
                this.processCancellation(Roles.Server, 'server disconnected');
                return;
            }
            case Cancellation.Receive.CLIENT_DISCONNECT: {
                // Other client disconnected
                const { role, reason: description } = JSON.parse(reason) as Cancellation.Message;
                this.processCancellation(role, description);
                return;
            }
            case Cancellation.Receive.LOGICAL_ERROR: {
                // Logical error by some role
                const { role, reason: description } = JSON.parse(reason);
                this.processCancellation(role, description);
                return;
            }
            default: {
                // Unsupported error code
                this.processCancellation(Roles.Server, reason);
                return;
            }
        }
    }

    private processCancellation(role: Roles.All, reason?: any) {
        this.setState({
            elem: this.props.cancellation(role, reason !== undefined ? String(reason) : reason),
        });
    }

    private cancel(error?: any) {
        const message = Cancellation.toChannel(Roles.Self, error);

        // Emit cancellation
        this.props.ws.close(Cancellation.Emit.LOGICAL_ERROR, JSON.stringify(message));

        // Process cancellation
        this.processCancellation(Roles.Self, error);
    }

    // ============
    // UI rendering
    // ============

    render() {
        return this.state.elem;
    }

}