export enum TransmitType {
	Broadcast = 'broadcast',
	Unicast = 'unicast',
}

export enum ActionType {
	CreateRoom = 'createRoom',
}

export enum MsgType {
	Action = 'action',
	Transmit = 'transmit',
}

export interface Message {
	msgType: MsgType;
}

export interface BareActionMessage {
	msgType: MsgType.Action;
	actionType: ActionType;
}

export type CreateRoomMessage = BareActionMessage & {
	actionType: ActionType.CreateRoom;
	data: Omit<Room, 'users'>;
};

export type ActionMessage = CreateRoomMessage;

export type BareTransmitMessage = {
	msgType: MsgType.Transmit;
	tranType: TransmitType;
	data: Record<string, unknown>;
	from: string;
};
export interface BroadcastMessage extends BareTransmitMessage {
	tranType: TransmitType.Broadcast;
}

export interface UnicastMessage extends BareTransmitMessage {
	tranType: TransmitType.Unicast;
	to: string;
}

export type TransmitMessage = BroadcastMessage | UnicastMessage;
export interface Client {
	uuid: string;
	nickName: string;
	ws: WebSocket;
}

export interface Room {
	desc: string;
	users: string[];
	uuid: string;
	name: string;
	passwd?: string;
}
