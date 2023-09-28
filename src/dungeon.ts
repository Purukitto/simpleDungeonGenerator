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
		windingPercent: number,
		tiles: GeneratorOptions["tiles"],
		indexedRooms: boolean
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

		this.#_addRoom(roomTries, extraRoomSize, indexedRooms);

		// Fill in all of the empty space with mazes.
		for (var y = 1; y < this.bounds.height - 1; y += 2) {
			for (var x = 1; x < this.bounds.width - 1; x += 2) {
				let pos = { x, y };
				if (!this.#_isWall(pos)) continue;

				this.#_growMaze(pos, windingPercent);
			}
		}

		this.#_removeDeadEnds();
	}

	drawToConsole() {
		console.log(this.map.map((row) => row.join(" ")).join("\n"));
	}

	#_addRoom(roomTries: number, extraRoomSize: number, indexedRooms: boolean) {
		let roomIndex = 1;
		for (let i = 0; i < roomTries; i++) {
			// TODO: This isn't very flexible or tunable. Do something better here.
			const size = Math.max(
				2,
				Math.floor(this.rng() * (1 + 2 * extraRoomSize) + 1) +
					extraRoomSize
			);
			const rectangularity = Math.floor(this.rng() * (1 + size / 2));

			let width = size;
			let height = size;

			if (this.rng() < 0.5) {
				width += rectangularity;
			} else {
				height += rectangularity;
			}

			const x = Math.floor(
				this.rng() * (this.bounds.width - width - 2) + 2
			);

			const y = Math.floor(
				this.rng() * (this.bounds.height - height - 2) + 2
			);

			const room = new Room(x, y, width, height);

			var overlaps = false;

			for (let otherRoom of this.rooms) {
				if (room.overlap(otherRoom)) {
					overlaps = true;
					break;
				}
			}

			if (overlaps) continue;

			this.rooms.add(room);

			room.getTiles().map((pos) => {
				// Check if pos is within the map bounds
				if (
					pos.x >= 0 &&
					pos.x < this.bounds.width &&
					pos.y >= 0 &&
					pos.y < this.bounds.height
				) {
					if (indexedRooms) {
						this.#_carve(pos, roomIndex);
					} else this.#_carve(pos); // TODO: can pass i value to mark rooms with a flag
				}
			});

			roomIndex++;
		}
	}

	#_carve(pos: { x: number; y: number }, tileType?: any) {
		// TODO: Implement tile types
		if (!tileType) tileType = this.tiles.floor;
		const row = this.map[pos.y];
		if (row) row[pos.x] = tileType;
	}

	#_isWall(pos: { x: number; y: number }) {
		return this.#_getTile(pos) === this.tiles.wall;
	}

	#_getTile(pos: { x: number; y: number }) {
		const row = this.map[pos.y];
		if (row) return row[pos.x];
	}

	#_growMaze(start: { x: number; y: number }, windingPercent: number) {
		let cells: { x: number; y: number }[] = [];
		let lastDir: string = "";

		this.#_carve(start, this.tiles.path);

		cells.push(start);

		while (cells.length > 0) {
			let cell = cells.pop();
			if (!cell) break;

			// See which adjacent cells are open.
			let unmadeCells = [];

			for (const dir of ["N", "S", "E", "W"]) {
				if (this.#_canCarve(cell, dir)) {
					unmadeCells.push(dir);
				}
			}

			if (unmadeCells.length > 0) {
				// Based on how "windy" passages are, try to prefer carving in the
				// same direction.
				let dir: string;
				if (
					unmadeCells.includes(lastDir) &&
					Math.floor(this.rng() * 101) > windingPercent
				) {
					dir = lastDir;
				} else {
					dir = unmadeCells.splice(
						Math.floor(this.rng() * unmadeCells.length),
						1
					)[0]!;
				}

				this.#_carve(this.#_addDirection(cell, dir)!, this.tiles.path);
				this.#_carve(
					this.#_addDirection(cell, dir, 2)!,
					this.tiles.path
				);

				cells.push(this.#_addDirection(cell, dir, 2)!);
				lastDir = dir;
			} else {
				// No adjacent uncarved cells.
				cells.pop();

				// This path has ended.
				lastDir = "";
			}
		}
	}

	#_addDirection(pos: { x: number; y: number }, dir: string, stepValue = 1) {
		if (dir == "N") {
			return { x: pos.x, y: pos.y - stepValue };
		}
		if (dir == "S") {
			return { x: pos.x, y: pos.y + stepValue };
		}
		if (dir == "E") {
			return { x: pos.x + stepValue, y: pos.y };
		}
		if (dir == "W") {
			return { x: pos.x - stepValue, y: pos.y };
		}
	}

	#_canCarve(pos: { x: number; y: number }, dir: string) {
		const oneStep = this.#_addDirection(pos, dir);
		const twoStep = this.#_addDirection(pos, dir, 2);
		const threeStep = this.#_addDirection(pos, dir, 3);

		// threeStep are out of bounds, return false
		if (
			!oneStep ||
			!twoStep ||
			!threeStep ||
			threeStep.x < 0 ||
			threeStep.x >= this.bounds.width ||
			threeStep.y < 0 ||
			threeStep.y >= this.bounds.height
		)
			return false;

		return this.#_isWall(oneStep!) && this.#_isWall(twoStep!);
	}

	#_removeDeadEnds() {
		let done = false;

		while (!done) {
			done = true;

			for (let pos of this.#_inflateBounds(this.bounds, -1)) {
				if (this.#_getTile(pos) == this.tiles.wall) continue;

				// If it only has one exit, it's a dead end.
				let exits = 0;
				for (let dir of ["N", "S", "E", "W"]) {
					if (
						this.#_getTile(this.#_addDirection(pos, dir)!) !=
						this.tiles.wall
					)
						exits++;
				}

				if (exits != 1) continue;

				done = false;
				this.#_carve(pos, this.tiles.wall);
			}
		}
	}

	#_inflateBounds(bounds: { height: number; width: number }, value: number) {
		const positions = [];

		for (
			let y = Math.max(0, -value);
			y < Math.min(bounds.height, bounds.height - value);
			y++
		) {
			for (
				let x = Math.max(0, -value);
				x < Math.min(bounds.width, bounds.width - value);
				x++
			) {
				positions.push({ x, y });
			}
		}

		return positions;
	}
}
