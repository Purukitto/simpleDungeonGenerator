import Dungeon from "./src/dungeon";

/**
 *
 * @param seed
 * @param maxH
 * @param maxW
 *
 * Based on https://journal.stuffwithstuff.com/2014/12/21/rooms-and-mazes/
 */
function simpleDungeon(options: GeneratorOptions) {
	// Options for the dungeon generator
	const maxH = options.maxH; // Max height
	const maxW = options.maxW; // Max width
	const seed = options.seed ? options.seed : ""; // Seed
	const type = options.type ? options.type : "Base"; // Type of dungeon //TODO: Implement types
	const roomTries = options.roomTries ? options.roomTries : 100; // Number of times to try to place a room
	const extraConnectorChance = options.extraConnectorChance
		? options.extraConnectorChance >= 20
			? options.extraConnectorChance
			: 20
		: 20; // Chance to add extra connectors between rooms
	const extraRoomSize = options.extraRoomSize
		? options.extraRoomSize >= 0
			? options.extraRoomSize
			: 0
		: 0; // Allows rooms to be larger
	const windingPercent = options.windingPercent
		? options.windingPercent >= 0
			? options.windingPercent
			: 0
		: 0; // Chance to add winding paths between rooms
	const tiles = options.tiles
		? options.tiles
		: {
				floor: ".",
				wall: "#",
				table: "T",
				openDoor: "O",
				closedDoor: "C",
				stairs: "S",
				grass: "g",
				tree: "t",
		  }; // Tiles to use

	// Create dungeon object
	const dungeon = new Dungeon(
		maxH,
		maxW,
		seed,
		roomTries,
		extraRoomSize,
		windingPercent,
		tiles
	);
	const dungeonMap = dungeon.map;

	return dungeonMap;
}

export default simpleDungeon;
