import { defineConfig } from "rolldown";

const nodeBuiltins = [
	"node:fs",
	"node:fs/promises",
	"node:path",
	"node:crypto",
	"node:module",
	"fs",
	"path",
	"crypto",
	"util",
	"url",
	"assert",
];

export default defineConfig([
	{
		input: "src/cli.ts",
		output: {
			file: "dist/cli.js",
			format: "esm",
		},
		external: ["svg-sprite", "yargs", ...nodeBuiltins],
	},
]);
