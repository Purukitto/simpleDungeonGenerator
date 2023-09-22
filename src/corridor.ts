export function Corridor(
	x: number,
	y: number,
	length: number,
	direction: number
): Corridor {
	const corridor: Corridor = {
		x: x ?? 0,
		y: y ?? 0,
		length: length ?? 0,
		direction: direction ?? 0,
	};
	return corridor;
}
