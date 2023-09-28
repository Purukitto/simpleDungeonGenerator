type GeneratorOptions = {
	seed?: string;
	maxH: number;
	maxW: number;
	type: string;
	roomTries: number;
	extraRoomSize: number;
	windingPercent: number;
	tiles: {
		floor: string;
		path: string;
		wall: string;
		table: string;
		openDoor: string;
		closedDoor: string;
		stairs: string;
		grass: string;
		tree: string;
	};
};
