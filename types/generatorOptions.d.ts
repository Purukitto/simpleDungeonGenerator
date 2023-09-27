type GeneratorOptions = {
	seed?: string;
	maxH: number;
	maxW: number;
	type: string;
	roomTries: number;
	extraConnectorChance: number;
	extraRoomSize: number;
	windingPercent: number;
	tiles: {
		floor: string;
		wall: string;
		table: string;
		openDoor: string;
		closedDoor: string;
		stairs: string;
		grass: string;
		tree: string;
	};
};