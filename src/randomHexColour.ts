/**
 * Returns a random hex colour string
 *
 * @param {PRNG} rng - A seeded PRNG
 *
 * @returns {string} A random hex colour string
 *
 * @example
 * getRandomHexColour(rng); // => "#ff0000"
 */

import { PRNG } from "seedrandom";

export default function getRandomHexColour(rng: PRNG) {
	// Generate random values for red, green, and blue components
	const red = Math.floor(Math.random() * 256); // 0 to 255
	const green = Math.floor(Math.random() * 256); // 0 to 255
	const blue = Math.floor(Math.random() * 256); // 0 to 255

	// Convert the RGB values to a hex string
	const hex =
		"#" +
		red.toString(16).padStart(2, "0") +
		green.toString(16).padStart(2, "0") +
		blue.toString(16).padStart(2, "0");

	return hex;
}
