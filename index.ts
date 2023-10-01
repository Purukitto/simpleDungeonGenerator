import Dungeon from "./src/dungeon";

const defaultTiles = {
	floor: "⛶",
	path: "·",
	wall: "■",
	table: "T",
	openDoor: "O",
	closedDoor: "C",
	stairs: "S",
	grass: "g",
	tree: "t",
};

const defaultOptions = {
	maxH: 50,
	maxW: 50,
	seed: "purukitto",
	type: "Base",
	roomTries: 100,
	extraRoomSize: 0,
	windingPercent: 0,
	tiles: defaultTiles,
	startIndex: 1,
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
	const maxH = options.maxH; // Max height
	const maxW = options.maxW; // Max width
	const seed = options.seed ? options.seed : defaultOptions.seed; // Seed
	const type = options.type ? options.type : defaultOptions.type; // Type of dungeon //TODO: Implement dungeon types
	const roomTries = options.roomTries
		? options.roomTries
		: defaultOptions.roomTries; // Number of times to try to place a room
	const extraRoomSize = options.extraRoomSize
		? options.extraRoomSize
		: defaultOptions.extraRoomSize; // Allows rooms to be larger
	if (extraRoomSize < 0)
		throw new Error("extraRoomSize must be greater than or equal to 0");
	const windingPercent = options.windingPercent
		? options.windingPercent
		: defaultOptions.windingPercent; // Chance to add winding paths between rooms
	if (windingPercent < 0 || windingPercent > 100)
		throw new Error("windingPercent must be between 0 and 100");
	const tiles = options.tiles
		? { ...defaultTiles, ...options.tiles }
		: defaultTiles; // Tiles to use
	const startIndex = options.startIndex
		? options.startIndex
		: defaultOptions.startIndex; // Index to start at

	// Create and return dungeon object
	return new Dungeon(
		maxH,
		maxW,
		seed,
		roomTries,
		extraRoomSize,
		windingPercent,
		tiles,
		startIndex
	);
}

export default simpleDungeon;
