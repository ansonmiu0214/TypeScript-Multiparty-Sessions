import WebSocket from 'ws';

import { Roles, Implementation, MessageHandler } from './EFSM';

/**
 * Helper types
 *
 * TODO: decouple from this file.
 */
type Partial<T> = { [K in keyof T]: T[K] | undefined }
type RoleToSocket = { [Role in Roles]: WebSocket }

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
        initialState: Implementation.S10) {
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

    private initialState: Implementation.S10
    private messageQueue: any[] = []
    private handlerQueue: (MessageHandler)[] = []

    constructor(wss: WebSocket.Server,
        roleToSocket: RoleToSocket,
        initialState: Implementation.S10) {
        this.wss = wss;
        this.roleToSocket = roleToSocket;
        this.initialState = initialState;

        // Bind instance methods.
        this.next = this.next.bind(this);
        this.receive = this.receive.bind(this);
        this.registerMessageHandler = this.registerMessageHandler.bind(this);
        this.send = this.send.bind(this);

        // Bind socket message handler.
        Object.entries(this.roleToSocket).forEach(([role, socket]) => {
            socket.addEventListener('message', this.receive(role));
        });

        // Initialise queues for receiving.
        this.messageQueue = []
        this.handlerQueue = []

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

    receive(from: string) {
        return ({ data }: WebSocketMessage) => {
            const { role, label, payload } = JSON.parse(data);
            if (role !== 'Svr') {
                // Route message
                this.send(role, label, payload, from);
            } else {
                if (this.handlerQueue.length > 0) {
                    this.handlerQueue.shift()!(data);
                } else {
                    this.messageQueue.push(data);
                }
            }
        }
    }

    registerMessageHandler(messageHandler: MessageHandler) {
        if (this.messageQueue.length > 0) {
            messageHandler(this.messageQueue.shift());
        } else {
            this.handlerQueue.push(messageHandler);
        }
    }

    terminate() {
        Object.values(this.roleToSocket).forEach(socket => socket.close());
        new Svr(this.wss, this.initialState);
    }
}