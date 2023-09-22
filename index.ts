import { Dungeon } from "./src/dungeon";

export const generateDungeon = (width: number, height: number): Dungeon => {
	const dungeon = Dungeon(width, height);
	dungeon.generate();
	return dungeon;
};
