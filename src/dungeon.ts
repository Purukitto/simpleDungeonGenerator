/**
 * Dungeon generator options.
 *
 * @class Dungeon
 * @property {number} maxH Maximum height of the dungeon.
 * @property {number} maxW Maximum width of the dungeon.
 * @property {string} seed Seed for the dungeon generator.
 * @property {number} roomTries Number of times to try to generate a room.
 * @property {number} extraRoomSize Extra size to add to the room.
 * @property {number} windingPercent Percent chance to continue in the same direction.
 * @property {object} tiles Tiles to use for the dungeon.
 * @property {number} startIndex Index to start room numbering from.
 *
 * @constructor
 * @param {number} maxH Maximum height of the dungeon.
 * @param {number} maxW Maximum width of the dungeon.
 * @param {string} seed Seed for the dungeon generator.
 * @param {number} roomTries Number of times to try to generate a room.
 * @param {number} extraRoomSize Extra size to add to the room.
 * @param {number} windingPercent Percent chance to continue in the same direction.
 * @param {object} tiles Tiles to use for the dungeon.
 * @param {number} startIndex Index to start room numbering from.
 *
 * @returns Dungeon generator options.
 *
 * @example
 * const options = {
 * 	maxH: 40,
 * 	maxW: 40,
 * 	seed: "seed",
 * 	roomTries: 1000,
 * 	extraRoomSize: 2,
 * 	windingPercent: 0,
 * 	tiles: {
 * 		wall: "#",
 * 		floor: ".",
 * 		path: " ",
 * 	},
 * 	startIndex: 0,
 * };
 *
 * const dungeon = new Dungeon(options);
 *
 * dungeon.drawToConsole(true);
 */

import seedrandom, { PRNG } from "seedrandom";
import Room from "./room";
import getRandomHexColour from "./randomHexColour";
import getContrastColour from "./contrastColour";

type MapTile = string; // Define a type for map tiles.

export default class Dungeon {
	map: string[][];
	#rng: PRNG;
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
		startIndex: number
	) {
		this.#rng = seedrandom(seed);
		this.bounds = { height: maxH, width: maxW };
		this.tiles = tiles;
		this.map = Array.from({ length: maxH }, () => {
			return Array.from({ length: maxW }, () => {
				return tiles.wall;
			});
		});
		this.rooms = new Set();

		this.#_addRoom(roomTries, extraRoomSize, startIndex);

		// Fill in all of the empty space with mazes.
		for (var y = 1; y < this.bounds.height - 1; y += 2) {
			for (var x = 1; x < this.bounds.width - 1; x += 2) {
				let pos = { x, y };
				if (!this.#_isWall(pos)) continue;

				this.#_growMaze(pos, windingPercent);
			}
		}

		this.#_connectUnconnectedRooms();
		this.#_removeDeadEnds();
	}

	drawToConsole(withIndex = false) {
		let displayMap: string[][];

		if (withIndex) {
			// Create a copy of the map to display room indices without modifying the original map.
			displayMap = this.map.map((row) => [...row]);
			displayMap = displayMap.map((row) => row.map((tile) => tile + " "));

			for (const room of this.rooms) {
				room.getTiles().forEach((pos) => {
					// Check if the position is within the map bounds.
					if (
						pos.x >= 0 &&
						pos.x < this.bounds.width &&
						pos.y >= 0 &&
						pos.y < this.bounds.height
					) {
						// Display room index in the copied map.
						const displayMapLeft = displayMap[pos.y]!;
						displayMapLeft[pos.x] = room.index
							.toString()
							.padEnd(2, " ");
					}
				});
			}
		} else {
			// If withIndex is false, just use the original map.
			displayMap = this.map;
		}

		// Print the modified or original map to the console.
		console.log(displayMap.map((row) => row.join(" ")).join("\n"));
	}

	drawToCanvas({ withIndex = false, withColour = false }) {
		const canvas = document.createElement("canvas");
		canvas.width = this.bounds.width * 10;
		canvas.height = this.bounds.height * 10;
		const ctx = canvas.getContext("2d")!;

		// let displayMap = this.map.map((row) => row.slice()); // Create a copy if necessary

		let tileWidth = 10;
		let tileHeight = 10;

		// Draw the map to the canvas.
		for (let y = 0; y < this.bounds.height; y++) {
			for (let x = 0; x < this.bounds.width; x++) {
				const mapLeft = this.map[y]!;
				const tile = mapLeft[x];
				ctx.fillStyle =
					tile === this.tiles.path ? "#ffffff" : "#000000";
				ctx.fillRect(
					x * tileWidth,
					y * tileHeight,
					tileWidth,
					tileHeight
				);
			}
		}

		// If withIndex is true, write the room.index to the center of each room to the canvas.
		// If withColour is true, use a room.colour for each room else use blue for all rooms

		for (const room of this.rooms) {
			room.getTiles().forEach((pos) => {
				// Check if the position is within the map bounds.
				if (
					pos.x >= 0 &&
					pos.x < this.bounds.width &&
					pos.y >= 0 &&
					pos.y < this.bounds.height
				) {
					// Display room index in the copied map.
					const mapLeft = this.map[pos.y]!;
					mapLeft[pos.x] = room.index.toString().padEnd(2, " ");

					if (withColour) {
						ctx.fillStyle = room.colour;
					} else {
						ctx.fillStyle = "#ff0000";
					}

					ctx.fillRect(
						pos.x * tileWidth,
						pos.y * tileHeight,
						tileWidth,
						tileHeight
					);

					if (withIndex) {
						ctx.fillStyle = "#ffffff";
						ctx.font = "10px sans-serif";
						ctx.textAlign = "center";
						ctx.textBaseline = "middle";
						ctx.fillText(
							room.index.toString(),
							pos.x * tileWidth + tileWidth / 2,
							pos.y * tileHeight + tileHeight / 2
						);
					}
				}
			});
		}

		return canvas;
	}

	drawToSVG({ withIndex = false, withColour = false }) {
		const svgNS = "http://www.w3.org/2000/svg";
		const svg = document.createElementNS(svgNS, "svg");
		svg.setAttribute("width", (this.bounds.width * 10).toString());
		svg.setAttribute("height", (this.bounds.height * 10).toString());

		// Draw the base map to the SVG.
		for (let y = 0; y < this.bounds.height; y++) {
			for (let x = 0; x < this.bounds.width; x++) {
				const mapLeft = this.map[y]!;
				const tile = mapLeft[x];
				const rect = document.createElementNS(svgNS, "rect");
				rect.setAttribute("x", (x * 10).toString());
				rect.setAttribute("y", (y * 10).toString());
				rect.setAttribute("width", "10");
				rect.setAttribute("height", "10");
				switch (tile) {
					case this.tiles.path:
						rect.setAttribute("fill", "#000000");
						break;
					case this.tiles.floor:
						rect.setAttribute("fill", "#ff0000");
						break;
					default:
						rect.setAttribute("fill", "#ffffff");
						break;
				}
				svg.appendChild(rect);
			}
		}

		// Draw room colours.
		if (withColour) {
			for (const room of this.rooms) {
				room.getTiles().forEach((pos) => {
					const mapLeft = this.map[pos.y]!;
					mapLeft[pos.x] = room.index.toString().padEnd(2, " ");

					const rect = document.createElementNS(svgNS, "rect");
					rect.setAttribute("x", (pos.x * 10).toString());
					rect.setAttribute("y", (pos.y * 10).toString());
					rect.setAttribute("width", "10");
					rect.setAttribute("height", "10");
					rect.setAttribute("fill", room.colour);
					svg.appendChild(rect);
				});
			}
		}

		// Draw room indices
		if (withIndex) {
			for (const room of this.rooms) {
				let roomCenterX = 0;
				let roomCenterY = 0;
				let totalTiles = 0;

				room.getTiles().forEach((pos) => {
					roomCenterX += pos.x;
					roomCenterY += pos.y;
					totalTiles++;
				});

				// Calculate the center position. If the totalTiles is even, adjust by +0.5 to center it.
				const centerX =
					Math.floor(roomCenterX / totalTiles) +
					(totalTiles % 2 === 0 ? +0.5 : 0);
				const centerY =
					Math.floor(roomCenterY / totalTiles) +
					(totalTiles % 2 === 0 ? +0.5 : 0);

				const text = document.createElementNS(svgNS, "text");
				text.setAttribute("font-family", "sans-serif");
				text.setAttribute("x", (centerX * 10 + 5).toString());
				text.setAttribute("y", (centerY * 10 + 5).toString());
				if (withColour)
					text.setAttribute("fill", getContrastColour(room.colour));
				else text.setAttribute("fill", "#ffffff");
				text.setAttribute("font-size", "10");
				text.setAttribute("text-anchor", "middle");
				text.setAttribute("dominant-baseline", "middle");
				text.textContent = room.index.toString();
				svg.appendChild(text);
			}
		}

		return svg;
	}

	#_addRoom(roomTries: number, extraRoomSize: number, startIndex: number) {
		let roomIndex = startIndex;

		for (let i = 0; i < roomTries; i++) {
			// TODO: Revisit this logic
			const size = Math.max(
				2,
				Math.floor(this.#rng() * (1 + 2 * extraRoomSize) + 1) +
					extraRoomSize
			);
			const rectangularity = Math.floor(this.#rng() * (1 + size / 2));

			let width = size;
			let height = size;

			if (this.#rng() < 0.5) {
				width += rectangularity;
			} else {
				height += rectangularity;
			}

			const x = Math.floor(
				this.#rng() * (this.bounds.width - width - 2) + 2
			);

			const y = Math.floor(
				this.#rng() * (this.bounds.height - height - 2) + 2
			);

			const room = new Room(
				x,
				y,
				width,
				height,
				roomIndex,
				getRandomHexColour(this.#rng)
			);

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
					this.#_carve(pos);
				}
			});
			roomIndex++;
		}
	}

	#_carve(pos: { x: number; y: number }, tileType?: MapTile) {
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
					Math.floor(this.#rng() * 101) > windingPercent //TODO: Revisit this logic, not a big influence
				) {
					dir = lastDir;
				} else {
					dir = unmadeCells.splice(
						Math.floor(this.#rng() * unmadeCells.length),
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

				if (exits > 1) continue;

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

	#_connectUnconnectedRooms() {
		const allRooms = Array.from(this.rooms);
		const room = allRooms.pop()!;

		while (allRooms.length > 0) {
			let toCheckLength = allRooms.length;

			while (toCheckLength > 0) {
				const otherRoom = allRooms[toCheckLength - 1]!;
				if (this.#_areRoomsConnected(room, otherRoom)) {
					allRooms.splice(toCheckLength - 1, 1);
				}

				toCheckLength--;
			}

			if (allRooms.length === 0) break;

			const roomToConnect = allRooms.pop()!;

			const closestRoom = Array.from(this.rooms)
				.filter((r) => r.index !== roomToConnect.index)
				.reduce((prev, curr) => {
					if (
						roomToConnect.distanceTo(curr) <
						roomToConnect.distanceTo(prev)
					)
						return curr;
					return prev;
				});

			if (closestRoom) {
				this.#_connectRooms(roomToConnect, closestRoom);
			} else {
				console.log("Could not connect room.", room.index);
				allRooms.unshift(roomToConnect);
				throw new Error(
					`Could not connect room ${room.index} with any other room.`
				);
			}
		}
	}

	// Bresenham's line algorithm: modified to avoid diagonal lines.
	#_connectRooms(room1: Room, room2: Room) {
		const center1 = room1.getCenter();
		const center2 = room2.getCenter();
		let startX = center1.x;
		let startY = center1.y;
		let endX = center2.x;
		let endY = center2.y;

		// Check relative positions and adjust connection direction
		if (startX > endX) {
			[startX, endX] = [endX, startX];
		}
		if (startY > endY) {
			[startY, endY] = [endY, startY];
		}

		// Calculate the differences in coordinates
		const dx = Math.abs(endX - startX);
		const dy = Math.abs(endY - startY);

		// Connect horizontally or vertically based on the shortest path
		if (dx > dy) {
			for (let x = startX; x <= endX; x++) {
				if (this.#_getTile({ x, y: startY }) === this.tiles.wall)
					this.#_carve({ x, y: startY }, this.tiles.path);
			}
		} else {
			for (let y = startY; y <= endY; y++) {
				if (this.#_getTile({ x: endX, y }) === this.tiles.wall)
					this.#_carve({ x: endX, y }, this.tiles.path);
			}
		}
	}

	#_areRoomsConnected(room1: Room, room2: Room): boolean {
		// Create a set to keep track of visited tiles/positions.
		const visited = new Set<string>();

		// Create a queue for BFS.
		const queue: { x: number; y: number }[] = [];

		// Find a starting position within the surrounding area that is on a "path" tile.
		let start = null;

		// Find a valid starting position within the surrounding area.
		for (const pos of room1.getTiles()) {
			for (const dir of ["N", "S", "E", "W"]) {
				const neighborPos = this.#_addDirection(pos, dir)!;

				if (this.#_getTile(neighborPos) === this.tiles.path) {
					start = neighborPos;
					break;
				}
			}
			if (start) break; // Found a valid starting position.
		}

		if (!start) {
			// No starting position on a neighboring "path" tile found in room1.
			return false;
		}

		queue.push(start);

		while (queue.length > 0) {
			const currentPos = queue.shift()!;

			// Mark the current position as visited.
			visited.add(`${currentPos.x},${currentPos.y}`);

			// Check if the current position neighbors room2
			for (const dir of ["N", "S", "E", "W"]) {
				const neighborPos = this.#_addDirection(currentPos, dir)!;

				if (room2.containsPosition(neighborPos)) {
					return true; // Found a path between room1 and room2.
				}
			}

			// Explore neighboring positions.
			for (const dir of ["N", "S", "E", "W"]) {
				const neighborPos = this.#_addDirection(currentPos, dir)!;

				const neighborPosKey = `${neighborPos.x},${neighborPos.y}`;

				// Check if the neighbor position is not visited, and is a valid "path" or "floor" tile.
				if (
					!visited.has(neighborPosKey) &&
					(this.#_getTile(neighborPos) === this.tiles.path ||
						this.#_getTile(neighborPos) === this.tiles.floor)
				) {
					// Add the neighbor position to the queue for further exploration.
					queue.push(neighborPos);
				}
			}
		}

		return false; // No path found between room1 and room2.
	}
}
