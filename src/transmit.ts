import { TransmitType } from './model.ts';

import type {
	BroadcastMessage,
	TransmitMessage,
	UnicastMessage,
} from './model.ts';

const CLIENT_MAP = new Map<string, WebSocket>();
export const broadcast = (msg: BroadcastMessage) => {
	const clients = CLIENT_MAP.values();
	Array.from(clients).forEach((client) =>
		client.send(JSON.stringify(JSON.stringify(msg)))
	);
};

export const unicast = (msg: UnicastMessage) => {
	const { to, ...rest } = msg;
	const client = CLIENT_MAP.get(to);
	client?.send(JSON.stringify(rest));
};

export const transmitMessage = (msg: TransmitMessage) => {
	if (msg?.tranType === TransmitType.Broadcast) {
		broadcast(msg);
		return;
	}
	unicast(msg);
};

export const createClient = (name: string, ws: WebSocket) => {
	CLIENT_MAP.set(name, ws);
};
