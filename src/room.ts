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

	distanceTo(other: Room) {
		const center1 = this.getCenter(this);
		const center2 = this.getCenter(other);
		const dx = center1.x - center2.x;
		const dy = center1.y - center2.y;
		return Math.sqrt(dx * dx + dy * dy);
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
