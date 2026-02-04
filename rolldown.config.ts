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
		input: ["src/index.ts", "src/cli.ts"],
		output: {
			dir: "dist",
			format: "esm",
		},
		external: [
			"svg-sprite",
			"vinyl",
			"yargs",
			"yargs/helpers",
			...nodeBuiltins,
		],
	},
]);
