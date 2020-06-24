import * as Roles from './Roles';

export interface Channel {
    role: Roles.Peers
    label: string
    payload: any[]
};

export const ConnectRequest = {
    connect: Roles.Self
};

export const toChannel = (role: Roles.All, label: string, payload: any[]) => (
    { role, label, payload }
);