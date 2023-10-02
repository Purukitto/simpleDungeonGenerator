import { defineConfig } from "tsup";

export default defineConfig({
	entryPoints: ["index.ts"],
	format: ["cjs", "esm", "iife"],
	outDir: "dist",
	dts: true,
	minify: true,
	clean: true,
});
