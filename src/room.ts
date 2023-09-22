export function Room(
	x: number,
	y: number,
	width: number,
	height: number
): Room {
	const room: Room = {
		x: x ?? 0,
		y: y ?? 0,
		width: width ?? 0,
		height: height ?? 0,
		centre: {
			x: 0,
			y: 0,
		},
	};
	room.centre.x = Math.floor(room.x + room.width / 2);
	room.centre.y = Math.floor(room.y + room.height / 2);
	return room;
}
