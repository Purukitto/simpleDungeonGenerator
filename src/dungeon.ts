import seedrandom, { PRNG } from "seedrandom";
import Room from "./room";

export default class Dungeon {
	map: string[][];
	rng: PRNG;
	tiles: GeneratorOptions["tiles"];
	bounds: { height: number; width: number };
	rooms: Set<Room>;
	constructor(
		maxH: number,
		maxW: number,
		seed: string,
		roomTries: number,
		extraRoomSize: number,
		tiles: GeneratorOptions["tiles"]
	) {
		this.rng = seedrandom(seed);
		this.bounds = { height: maxH, width: maxW };
		this.tiles = tiles;
		this.map = Array.from({ length: maxH }, () => {
			return Array.from({ length: maxW }, () => {
				return tiles.wall;
			});
		});
		this.rooms = new Set();

		this.#_addRoom(roomTries, extraRoomSize);
	}

	#_addRoom(roomTries: number, extraRoomSize: number) {
		for (let i = 0; i < roomTries; i++) {
			// TODO: This isn't very flexible or tunable. Do something better here.
			const size = Math.floor(
				this.rng() * (3 + extraRoomSize - 1) * 2 + 1
			);
			const rectangularity = Math.floor(
				this.rng() * (1 + Math.floor(size / 2)) * 2
			);

			let width = size;
			let height = size;

			if (this.rng() < 0.5) {
				width += rectangularity;
			} else {
				height += rectangularity;
			}

			const x = Math.floor(
				this.rng() * (Math.floor(this.bounds.width - width) / 2) * 2 + 1
			);
			const y = Math.floor(
				this.rng() * (Math.floor(this.bounds.height - height) / 2) * 2 +
					1
			);

			// var room = new Rect(x, y, width, height);
			const room = new Room(x, y, width, height);

			var overlaps = false;

			for (let otherRoom of this.rooms) {
				if (room.distanceTo(otherRoom) <= 0) {
					overlaps = true;
					break;
				}
			}

			if (overlaps) continue;

			this.rooms.add(room);

			// _startRegion(); TODO: Implement regions
			// for (var pos in room) {
			// 	this.#_carve(pos);
			// }
			room.getTiles().map((pos) => {
				// Check if pos is within the map bounds
				if (
					pos.x >= 0 &&
					pos.x < this.bounds.width &&
					pos.y >= 0 &&
					pos.y < this.bounds.height
				) {
					this.#_carve(pos);
				}
			});
		}
	}

	#_carve(pos: { x: number; y: number }, tileType?: any) {
		// TODO: Implement tile types
		if (!tileType) tileType = this.tiles.floor;

		this.map[pos.x][pos.y] = tileType;
	}
}
