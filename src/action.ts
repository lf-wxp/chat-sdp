import { ActionType } from './model.ts';

import type { ActionMessage, CreateRoomMessage, Room } from './model.ts';

const ROOM_MAP = new Map<string, Room>();

export const actionMessage = (msg: ActionMessage) => {
	if (msg?.actionType === ActionType.CreateRoom) {
		createRoom(msg);
		return;
	}
};

export const createRoom = (msg: CreateRoomMessage) => {
	const {
		data: { uuid, desc, passwd, name },
	} = msg;
	const room = ROOM_MAP.has(uuid);
	if (room) return;
	ROOM_MAP.set(uuid, { uuid, desc, passwd, name, users: [] });
};

export const getRooms = () => {
	return Array.from(ROOM_MAP.values());
};

export const getRoomsString = () => {
	return Array.from(ROOM_MAP.values()).map((item) => JSON.stringify(item));
};
