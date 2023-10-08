import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";

const bundle = (config) => ({
	...config,
	input: "index.ts",
});

export default [
	bundle({
		plugins: [esbuild()],
		output: [
			{
				file: `dist/index.js`,
				format: "cjs",
				sourcemap: true,
			},
			{
				file: `dist/index.mjs`,
				format: "es",
				sourcemap: true,
			},
		],
	}),
	bundle({
		plugins: [dts()],
		output: {
			file: `dist/index.d.ts`,
			format: "es",
		},
	}),
	bundle({
		input: "index.ts",
		output: {
			file: "dist/bundle.js",
			format: "umd",
			name: "simpleDungeon",
		},
		plugins: [esbuild(), commonjs(), resolve()],
	}),
];
