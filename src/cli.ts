#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { DEFAULT_CONFIG } from "./defaultConfig.js";
import { runGenerator } from "./generator.js";
import type { SvgIconSpriteConfig } from "./types.js";

const argv = await yargs(hideBin(process.argv))
	.option("inputFolder", {
		type: "string",
		description: "Folder containing SVG files",
		demandOption: true,
	})
	.option("outputSpriteFolder", {
		type: "string",
		description: "Output folder for sprite file",
		demandOption: true,
	})
	.option("outputSpriteFileName", {
		type: "string",
		description: "Name of generated sprite file",
		default: DEFAULT_CONFIG.outputSpriteFileName,
	})
	.option("outputIdsFolder", {
		type: "string",
		description: "Output folder for IDs file",
		demandOption: true,
	})
	.option("outputIdsFileName", {
		type: "string",
		description: "Name of generated IDs file",
		default: DEFAULT_CONFIG.outputIdsFileName,
	})
	.option("outputIdsExportedConstName", {
		type: "string",
		description: "Name of exported constant in IDs file",
		default: DEFAULT_CONFIG.outputIdsExportedConstName,
	})
	.option("outputConstsFolder", {
		type: "string",
		description:
			"Output folder for constants file (defaults to outputIdsFolder)",
	})
	.option("outputConstsFileName", {
		type: "string",
		description: "Name of generated constants file",
		default: DEFAULT_CONFIG.outputConstsFileName,
	})
	.option("outputConstsExportedConstName", {
		type: "string",
		description: "Name of exported constant in constants file",
		default: DEFAULT_CONFIG.outputConstsExportedConstName,
	})
	.option("cssClassName", {
		type: "string",
		description: "CSS class name for icons",
		default: DEFAULT_CONFIG.cssClassName,
	})
	.option("verbose", {
		alias: "v",
		type: "boolean",
		description: "Verbose output",
		default: false,
	})
	.help()
	.alias("help", "h")
	.parseAsync();

async function main() {
	try {
		const config: SvgIconSpriteConfig = {
			inputFolder: argv.inputFolder,
			outputSpriteFolder: argv.outputSpriteFolder,
			outputSpriteFileName: argv.outputSpriteFileName,
			outputIdsFolder: argv.outputIdsFolder,
			outputIdsFileName: argv.outputIdsFileName,
			outputIdsExportedConstName: argv.outputIdsExportedConstName,
			// Use outputIdsFolder as default for other folders if not provided
			outputConstsFolder: argv.outputConstsFolder || argv.outputIdsFolder,
			outputConstsFileName: argv.outputConstsFileName,
			outputConstsExportedConstName: argv.outputConstsExportedConstName,
			cssClassName: argv.cssClassName,
		};

		if (argv.verbose) {
			console.log("📋 Configuration:", JSON.stringify(config, null, 2));
		}

		await runGenerator(config);
	} catch (error) {
		console.error("❌ Generation failed:", error);
		process.exit(1);
	}
}

main();
