import WebSocket from 'ws';

import { Roles, Implementation, MessageHandler } from './EFSM';

/**
 * Helper types
 *
 * TODO: decouple from this file.
 */
type Partial<T> = { [K in keyof T]: T[K] | undefined };
type RoleToSocket = { [Role in Roles]: WebSocket };
type RoleToMessageQueue = { [Role in Roles]: any[] };
type RoleToHandlerQueue = { [Role in Roles]: MessageHandler[] };

interface MPSTMessage {
    role: Roles | 'Svr'
    label: string
    payload: any[]
}

interface WebSocketMessage {
    data: any
    type: string
    target: WebSocket
}

interface JoinMessage {
    connect: Roles
}

/**
 * Joining
 */
export class Svr {

    private wss: WebSocket.Server
    private waiting: Set<Roles>
    private roleToSocket: Partial<RoleToSocket>

    constructor(wss: WebSocket.Server,
        initialState: Implementation.S7) {
        this.wss = wss;
        this.waiting = new Set<Roles>([Roles.Alice, Roles.Bob])

        this.roleToSocket = {
            [Roles.Alice]: undefined, [Roles.Bob]: undefined,
        };

        const onSubsribe = (event: WebSocketMessage) => {
            const { data, target: socket } = event;
            const { connect: role } = JSON.parse(data) as JoinMessage;
            if (!this.waiting.has(role)) {
                // Role already occupied
                return;
            }

            this.roleToSocket[role] = socket;
            this.waiting.delete(role);
            socket.removeEventListener('message', onSubsribe);
            if (this.waiting.size === 0) {
                this.wss.removeListener('connection', onConnection);
                for (const socket of Object.values(this.roleToSocket)) {
                    socket?.send(JSON.stringify({
                        connected: true
                    }));
                }
                new _Svr(this.wss, this.roleToSocket as RoleToSocket, initialState);
            }
        }

        const onConnection = (ws: WebSocket) => ws.addEventListener('message', onSubsribe);
        this.wss.addListener('connection', onConnection);
    }

}

class _Svr {

    private wss: WebSocket.Server
    private roleToSocket: RoleToSocket

    private initialState: Implementation.S7
    private messageQueue: RoleToMessageQueue
    private handlerQueue: RoleToHandlerQueue

    constructor(wss: WebSocket.Server,
        roleToSocket: RoleToSocket,
        initialState: Implementation.S7) {
        this.wss = wss;
        this.roleToSocket = roleToSocket;
        this.initialState = initialState;

        // Bind instance methods.
        this.next = this.next.bind(this);
        this.receive = this.receive.bind(this);
        this.registerMessageHandler = this.registerMessageHandler.bind(this);
        this.send = this.send.bind(this);

        // Bind socket message handler.
        Object.values(Roles).forEach(role => {
            this.roleToSocket[role].addEventListener('message', this.receive(role));
        })

        // Initialise queues for receiving.
        this.messageQueue = {
            [Roles.Alice]: [], [Roles.Bob]: [],
        };
        this.handlerQueue = {
            [Roles.Alice]: [], [Roles.Bob]: [],
        };

        // Initialise state machine.
        this.next(initialState);
    }

    // =====================
    // State machine methods
    // =====================
    next(implementation: Implementation.Type) {
        switch (implementation.type) {
            case 'Send': {
                return implementation.performSend(this.next, this.send);
            }
            case 'Receive': {
                return implementation.prepareReceive(this.next, this.registerMessageHandler);
            }
            case 'Terminal': {
                return this.terminate();
            }
        }
    }

    // ===============
    // Channel methods
    // ===============

    send(to: Roles, label: string, payload: any[], from: string = 'Svr') {
        this.roleToSocket[to].send(JSON.stringify({ role: from, label, payload }));
    }

    receive(from: Roles) {
        return ({ data }: WebSocketMessage) => {
            const { role, label, payload } = JSON.parse(data) as MPSTMessage;
            if (role !== 'Svr') {
                // Route message
                this.send(role, label, payload, from);
            } else {
                const handler = this.handlerQueue[from].shift();
                if (handler !== undefined) {
                    handler(data);
                } else {
                    this.messageQueue[from].push(data);
                }
            }
        }
    }

    registerMessageHandler(from: Roles, messageHandler: MessageHandler) {
        const message = this.messageQueue[from].shift();
        if (message !== undefined) {
            messageHandler(message);
        } else {
            this.handlerQueue[from].push(messageHandler);
        }
    }

    terminate() {
        Object.values(this.roleToSocket).forEach(socket => socket.close());
        new Svr(this.wss, this.initialState);
    }
}