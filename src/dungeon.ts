export function Dungeon(width: number, height: number): Dungeon {
	const dungeon: Dungeon = {
		width: width ?? 0,
		height: height ?? 0,
		tiles: [],
		rooms: [],
		corridors: [],
		generate: () => {
			
		},
		getRoomAt: (x: number, y: number): Room | null => {
			// ...
			return null;
		},
		getRoomsAt: (x: number, y: number): Room[] => {
			// ...
			return [];
		},
		getCorridorAt: (x: number, y: number): Corridor | null => {
			// ...
			return null;
		},
		getCorridorsAt: (x: number, y: number): Corridor[] => {
			// ...
			return [];
		},
		getDoorAt: (x: number, y: number): Door | null => {
			// ...
			return null;
		},
		getDoorsAt: (x: number, y: number): Door[] => {
			// ...
			return [];
		},
		getTileAt: (x: number, y: number): number => {
			// ...
			return 0;
		},
		getTilesAt: (x: number, y: number): number[] => {
			// ...
			return [];
		},
	};

	return dungeon;
}
