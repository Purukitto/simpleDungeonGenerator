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
	const type = options.type ? options.type : defaultOptions.type; // Type of dungeon //TODO: Implement types
	const roomTries = options.roomTries
		? options.roomTries
		: defaultOptions.roomTries; // Number of times to try to place a room
	const extraRoomSize = options.extraRoomSize
		? options.extraRoomSize >= defaultOptions.extraRoomSize // TODO: Throw error instead of defaulting to 0
			? options.extraRoomSize
			: defaultOptions.extraRoomSize
		: defaultOptions.extraRoomSize; // Allows rooms to be larger
	const windingPercent = options.windingPercent
		? options.windingPercent >= defaultOptions.windingPercent // TODO: Throw error instead of defaulting to 0
			? options.windingPercent
			: defaultOptions.windingPercent
		: defaultOptions.windingPercent; // Chance to add winding paths between rooms
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
