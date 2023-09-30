export default class Room {
	x: number;
	y: number;
	width: number;
	height: number;
	index: number;
	color: string;

	constructor(
		x: number,
		y: number,
		width: number,
		height: number,
		index: number,
		color: string
	) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.index = index;
		this.color = color;
	}

	overlap(room: Room) {
		return (
			this.x <= room.x + room.width &&
			this.x + this.width >= room.x &&
			this.y <= room.y + room.height &&
			this.y + this.height >= room.y
		);
	}

	getCenter() {
		const center = {
			x: this.x + this.width / 2,
			y: this.y + this.height / 2,
		};
		return center;
	}

	distanceTo(otherRoom: Room) {
		const center1 = this.getCenter();
		const center2 = otherRoom.getCenter();
		const dx = center1.x - center2.x;
		const dy = center1.y - center2.y;
		return Math.sqrt(dx * dx + dy * dy);
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

	getRandomPosition() {
		// Generate a random position within the bounds of the room.
		const randomX = Math.floor(Math.random() * this.width + this.x);
		const randomY = Math.floor(Math.random() * this.height + this.y);
		return { x: randomX, y: randomY };
	}

	containsPosition(position: { x: number; y: number }) {
		// Check if the given position is inside the room's bounds.
		return (
			position.x >= this.x &&
			position.x < this.x + this.width &&
			position.y >= this.y &&
			position.y < this.y + this.height
		);
	}
}
