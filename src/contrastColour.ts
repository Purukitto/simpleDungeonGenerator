/**
 * Returns a black or white colour based on the brightness of the given hex colour.
 *
 * @param {string} hexColour - A hex colour string
 * @returns {string} A black or white hex colour string
 */

export default function getContrastColour(hexColour: string) {
	// Convert hex to RGB
	const r = parseInt(hexColour.slice(1, 3), 16);
	const g = parseInt(hexColour.slice(3, 5), 16);
	const b = parseInt(hexColour.slice(5, 7), 16);

	// Calculate brightness using the formula: (r * 299 + g * 587 + b * 114) / 1000
	const brightness = (r * 299 + g * 587 + b * 114) / 1000;

	// Choose white or black based on brightness
	return brightness > 128 ? "#000000" : "#FFFFFF";
}
