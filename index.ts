import Dungeon from "./src/dungeon";

const defaultTiles = {
	blank: " ",
	floor: "⛶",
	path: "·",
	wall: "■",
	door: "#",
};

const defaultOptions = {
	maxH: 50,
	maxW: 50,
	seed: "purukitto",
	type: "Base",
	roomTries: 50,
	extraRoomSize: 0,
	windingPercent: 0,
	tiles: defaultTiles,
	startIndex: 1,
	doors: false,
};

/**
 * @function simpleDungeon
 * @param {GeneratorOptions} options
 *
 * @returns {Dungeon}
 * @description
 * Generates a simple dungeon
 *
 * Based on https://journal.stuffwithstuff.com/2014/12/21/rooms-and-mazes/
 */

function simpleDungeon(options?: GeneratorOptions) {
	if (!options) options = defaultOptions;
	// Options for the dungeon generator

	const maxH =
		typeof options.maxH != "undefined" ? options.maxH : defaultOptions.maxH; // Max height
	if (maxH < 5) throw new Error("maxH must be greater than 5");

	const maxW =
		typeof options.maxW != "undefined" ? options.maxW : defaultOptions.maxW; // Max width
	if (maxW < 5) throw new Error("maxW must be greater than 5");

	const seed =
		typeof options.seed !== "undefined"
			? options.seed.toString()
			: defaultOptions.seed; // Seed

	const type =
		typeof options.type !== "undefined"
			? options.type
			: defaultOptions.type; // Type of dungeon //TODO: Implement dungeon types

	const roomTries =
		typeof options.roomTries !== "undefined"
			? options.roomTries
			: defaultOptions.roomTries; // Number of times to try to place a room
	if (roomTries <= 0) throw new Error("roomTries must be greater than 0");

	const extraRoomSize =
		typeof options.extraRoomSize !== "undefined"
			? options.extraRoomSize
			: defaultOptions.extraRoomSize; // Allows rooms to be larger
	if (extraRoomSize < 0)
		throw new Error("extraRoomSize must be greater than or equal to 0");
	if (extraRoomSize > Math.floor(Math.min(maxH, maxW) / 5))
		console.warn(
			`extraRoomSize is too large for current dungeon, suggested setting this to under ${Math.floor(
				Math.min(maxH, maxW) / 5
			)}`
		);

	const windingPercent =
		typeof options.windingPercent !== "undefined"
			? options.windingPercent
			: defaultOptions.windingPercent; // Chance to add winding paths between rooms
	if (windingPercent < 0 || windingPercent > 100)
		throw new Error("windingPercent must be between 0 and 100");

	const tiles =
		typeof options.tiles !== "undefined"
			? { ...defaultTiles, ...options.tiles }
			: defaultTiles; // Tiles to use

	const startIndex =
		typeof options.startIndex !== "undefined"
			? options.startIndex
			: defaultOptions.startIndex; // Index to start at

	const doors =
		typeof options.doors !== "undefined"
			? options.doors
			: defaultOptions.doors; // Weather or not to add doors

	// Create and return dungeon object
	return new Dungeon(
		maxH,
		maxW,
		seed,
		roomTries,
		extraRoomSize,
		windingPercent,
		tiles,
		startIndex,
		doors
	);
}

export default simpleDungeon;
