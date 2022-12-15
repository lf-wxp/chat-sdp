import { serve } from 'https://deno.land/std@0.167.0/http/mod.ts';
import { is } from 'https://deno.land/x/ramda@v0.27.2/mod.ts';

import { MsgType } from './model.ts';
import { actionMessage, getRoomsString} from './action.ts';
import { createClient, transmitMessage } from "./transmit.ts";

import type {
	ActionMessage,
	TransmitMessage,
} from './model.ts';

const handleHttp = (req: Request) => {
	if (req.headers.get('upgrade') != 'websocket') {
		return new Response(null, { status: 501 });
	}
	const { socket, response } = Deno.upgradeWebSocket(req);
	const url = new URL(req.url);
	handleWebsocket(socket, url);
	return response;
};

const handleWebsocket = (ws: WebSocket, url: URL) => {
	const name = url.pathname.replace('/', '');
  createClient(name, ws);
	ws.onopen = () => {
		ws.send(`client ${name} is connected, exist room is ${getRoomsString()}`);
	};

	ws.onmessage = (event: MessageEvent<string>) => {
		if (!is(String, event.data)) return;
		console.log('data', event.data);
		let msg: ActionMessage | TransmitMessage | undefined = undefined;
		try {
			msg = JSON.parse(event.data);
		} catch {
			ws.send('the message is not valid json format message');
		}
		if (!msg) return;
		if (msg.msgType === MsgType.Action) {
			actionMessage(msg);
		}
		if (msg.msgType === MsgType.Transmit) {
			transmitMessage(msg);
		}
	};
};

serve(handleHttp, { port: 8080 });
