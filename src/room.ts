/**
 * Room class.
 * Represents a room in the dungeon.
 *
 * @class Room
 * @property {number} x - The x coordinate of the room's top-left corner.
 * @property {number} y - The y coordinate of the room's top-left corner.
 * @property {number} width - The width of the room.
 * @property {number} height - The height of the room.
 * @property {number} index - The index of the room in the dungeon's rooms array.
 * @property {string} colour - The color of the room.
 *
 * @constructor
 * @param {number} x - The x coordinate of the room's top-left corner.
 * @param {number} y - The y coordinate of the room's top-left corner.
 * @param {number} width - The width of the room.
 * @param {number} height - The height of the room.
 * @param {number} index - The index of the room in the dungeon's rooms array.
 * @param {string} colour - The color of the room.
 * @returns {Room} A new Room object.
 *
 * @example
 * const room = new Room(0, 0, 10, 10, 0, "#ff0000");
 * console.log(room);
 */

export default class Room {
	x: number;
	y: number;
	width: number;
	height: number;
	index: number;
	colour: string;

	constructor(
		x: number,
		y: number,
		width: number,
		height: number,
		index: number,
		colour: string
	) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.index = index;
		this.colour = colour;
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
			x: Math.floor(this.x + this.width / 2),
			y: Math.floor(this.y + this.height / 2),
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
