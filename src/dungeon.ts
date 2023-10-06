/**
 * Dungeon generator options.
 *
 * @class Dungeon
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
 * @param {boolean} doors Weather or not to add doors.
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
	_regions: number[][];
	windingPercent: number;
	#currentRegion = -1;

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
		this._regions = Array.from({ length: maxH }, () => {
			return Array.from({ length: maxW }, () => {
				return -1;
			});
		});
		this.windingPercent = windingPercent;
		this.rooms = new Set();

		this.#_addRoom(roomTries, extraRoomSize, startIndex);

		// Fill in all of the empty space with mazes.
		for (var y = 0; y < this.bounds.height - 1; y += 2) {
			for (var x = 0; x < this.bounds.width - 1; x += 2) {
				let pos = { x, y };
				if (!this.#_isWall(pos)) continue;

				this.#_growMaze(pos);
			}
		}

		this.#_connectRegions();

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
						// If edge wall
						if (
							pos.x !== room.x &&
							pos.x !== room.x + room.width - 1 &&
							pos.y !== room.y &&
							pos.y !== room.y + room.height - 1
						) {
							// Display room index in the copied map.
							const displayMapLeft = displayMap[pos.y]!;
							displayMapLeft[pos.x] = room.index
								.toString()
								.padEnd(2, " ");
						}
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
				Math.floor(this.#rng() * (1 + 2 * extraRoomSize) + 1)
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

			for (const otherRoom of this.rooms) {
				if (room.overlap(otherRoom)) {
					overlaps = true;
					break;
				}
			}

			if (overlaps) continue;

			this.rooms.add(room);

			this.#currentRegion++;

			// Carve a room, fill it with "floor" tiles
			room.getTiles().map((pos) => {
				// Check if pos is within the map bounds
				if (
					pos.x >= 0 &&
					pos.x < this.bounds.width &&
					pos.y >= 0 &&
					pos.y < this.bounds.height
				) {
					// Carve the room into the map.

					this.#_carve(pos);
				}
			});
			roomIndex++;
		}
	}

	#_growMaze(start: { x: number; y: number }) {
		let cells: { x: number; y: number }[] = [];
		let lastDir: string = "";

		this.#currentRegion++;
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
					Math.floor(this.#rng() * 101) > this.windingPercent //TODO: Revisit this logic, not a big influence
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

	#_removeDeadEnds() {
		// Find dead ends and remove them.
		let done = false;

		while (!done) {
			done = true;

			for (let x = 0; x < this.bounds.width; x++) {
				for (let y = 0; y < this.bounds.height; y++) {
					const pos = { x, y };
					if (
						this.#_getTile(pos) === this.tiles.wall ||
						this.#_countAdjacentExits(pos) > 1
					)
						continue;

					done = false;
					this.#_carve(pos, this.tiles.wall);
				}
			}
		}
	}

	#_countAdjacentExits(pos: { x: number; y: number }) {
		let count = 0;

		for (const dir of ["N", "S", "E", "W"]) {
			const neighborPos = this.#_addDirection(pos, dir)!;

			if (
				this.#_getTile(neighborPos) !== this.tiles.wall &&
				neighborPos.x > -1 &&
				neighborPos.x < this.bounds.width &&
				neighborPos.y > -1 &&
				neighborPos.y < this.bounds.height
			) {
				count++;
			}
		}

		return count;
	}

	#_connectRegions() {
		// Set to keep track of all connectors between regions.
		const regionConnectors = new Map<{ x: number; y: number }, number[]>();

		// Find all of the tiles that can connect two (or more) region
		for (let x = 1; x < this.bounds.width - 1; x++) {
			for (let y = 1; y < this.bounds.height - 1; y++) {
				const pos = { x, y };

				// Can't already be part of a region.
				if (this.#_getTile(pos) !== this.tiles.wall) continue;

				const regions = new Set<number>();
				for (const dir of ["N", "S", "E", "W"]) {
					const neighborPos = this.#_addDirection(pos, dir)!;
					const region =
						this._regions[neighborPos.y]![neighborPos.x]!;
					if (region > 0) regions.add(region);
				}

				if (regions.size < 2) continue;

				regionConnectors.set(pos, Array.from(regions));
			}
		}

		let connectors = Array.from(regionConnectors.keys());

		// Keep track of which regions have been merged.
		const merged = new Map<number, number>();
		const openRegions = new Set<number>(); // Set of regions yet to be merged.

		for (let i = 0; i <= this.#currentRegion; i++) {
			merged.set(i, i);
			openRegions.add(i);
		}

		// Keep connecting regions until we're down to one.
		while (openRegions.size > 1) {
			if (connectors.length < 1) break;
			const connector =
				connectors[Math.floor(this.#rng() * connectors.length)]!;

			// Carve the connection.
			this.#_addJunction(connector);

			// Merge the connected regions.
			// We'll pick one region and map all of the other regions to its index.
			const regions = regionConnectors
				.get(connector)!
				.map((region) => merged.get(region)!);

			const dest = regions[0]!;
			const sources = regions.slice(1);

			// Merge all of the affected regions.
			for (let i = 0; i <= this.#currentRegion; i++) {
				if (sources.includes(merged.get(i)!)) {
					merged.set(i, dest);
				}
			}

			// The sources are no longer in use.
			sources.forEach((source) => openRegions.delete(source));

			// Remove any connectors that aren't needed anymore.
			connectors = connectors.filter((pos) => {
				// Don't allow connectors right next to each other.
				if (
					Math.abs(connector.x - pos.x) +
						Math.abs(connector.y - pos.y) <
					2
				)
					return false;

				// If the connector no long spans different regions, we don't need it.
				const regionsLeft: Set<number> = new Set(
					regionConnectors
						.get(pos)!
						.map((region) => merged.get(region)!)
				);

				if (regionsLeft.size > 1) return true;

				return false;
			});
		}
	}

	#_addJunction(pos: { x: number; y: number }) {
		//TODO: Add different kind of connectors?

		if (this.#rng() <= 0.25) this.#_carve(pos, this.tiles.path);
		else this.#_carve(pos, this.tiles.door);
	}

	#_carve(pos: { x: number; y: number }, tileType?: MapTile) {
		if (!tileType) tileType = this.tiles.floor;
		const row = this.map[pos.y];
		if (row) {
			row[pos.x] = tileType;
			this._regions[pos.y]![pos.x] = this.#currentRegion;
		}
	}

	#_isWall(pos: { x: number; y: number }) {
		return this.#_getTile(pos) === this.tiles.wall;
	}

	#_getTile(pos: { x: number; y: number }) {
		const row = this.map[pos.y];
		if (row) return row[pos.x];
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
		if (dir == "NE") {
			return { x: pos.x + stepValue, y: pos.y - stepValue };
		}
		if (dir == "NW") {
			return { x: pos.x - stepValue, y: pos.y - stepValue };
		}
		if (dir == "SE") {
			return { x: pos.x + stepValue, y: pos.y + stepValue };
		}
		if (dir == "SW") {
			return { x: pos.x - stepValue, y: pos.y + stepValue };
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
}
