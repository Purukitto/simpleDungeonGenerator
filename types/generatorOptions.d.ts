/**
 * @typedef {Object} GeneratorOptions
 * @property {string} seed
 * @property {number} maxH
 * @property {number} maxW
 * @property {string} type
 * @property {number} roomTries
 * @property {number} extraRoomSize
 * @property {number} windingPercent
 * @property {Object} tiles
 * @property {number} startIndex
 */

type GeneratorOptions = {
	seed: string;
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
	startIndex: number;
};
