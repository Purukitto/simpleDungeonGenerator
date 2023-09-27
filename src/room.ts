export default class Room {
	x: number;
	y: number;
	width: number;
	height: number;

	constructor(x: number, y: number, width: number, height: number) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	overlap(room: Room) {
		return (
			this.x <= room.x + room.width &&
			this.x + this.width >= room.x &&
			this.y <= room.y + room.height &&
			this.y + this.height >= room.y
		);
	}

	getCenter(room: Room) {
		const center = {
			x: room.x + room.width / 2,
			y: room.y + room.height / 2,
		};
		return center;
	}

	getTiles() {
		const tiles = [];
		for (let x = this.x; x < this.x + this.width; x++) {
			for (let y = this.y; y < this.y + this.height; y++) {
				tiles.push({ x, y });
			}
		}
		return tiles;
	}
}
