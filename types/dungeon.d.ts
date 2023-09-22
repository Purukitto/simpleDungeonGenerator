type Dungeon = {
	width: number;
	height: number;
	tiles: number[];
	rooms: Room[];
	corridors: Corridor[];
	generate: () => void;
	getRoomAt: (x: number, y: number) => Room | null;
	getRoomsAt: (x: number, y: number) => Room[];
	getCorridorAt: (x: number, y: number) => Corridor | null;
	getCorridorsAt: (x: number, y: number) => Corridor[];
	getDoorAt: (x: number, y: number) => Door | null;
	getDoorsAt: (x: number, y: number) => Door[];
	getTileAt: (x: number, y: number) => number;
	getTilesAt: (x: number, y: number) => number[];
};
