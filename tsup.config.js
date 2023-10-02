import { defineConfig } from "tsup";

export default defineConfig({
	entryPoints: ["index.ts"],
	format: ["cjs", "esm"],
	outDir: "dist",
	dts: true,
	minify: true,
	clean: true,
});
