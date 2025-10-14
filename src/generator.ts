import * as path from "node:path";
import { generateConsts } from "./generateConsts.js";
import { generateIds } from "./generateIDs.js";
import { generateSprite } from "./generateSprite.js";
import { modifySvg } from "./modifySvg.js";
import type { SvgIconSpriteConfig } from "./types.js";

/**
 * Main generator function that orchestrates the entire sprite generation process
 */
export async function runGenerator(config: SvgIconSpriteConfig): Promise<void> {
	console.log("🚀 Starting SVG icon sprite generation...");

	const PATH_TO_SPRITE = path.resolve(
		`${config.outputSpriteFolder}/${config.outputSpriteFileName}`,
	);

	try {
		console.log("📦 Generating sprite...");
		await generateSprite(config);

		console.log("🎨 Modifying SVG...");
		await modifySvg({
			inputFile: PATH_TO_SPRITE,
			cssClassName: config.cssClassName,
		});

		console.log("🔤 Generating IDs...");
		const ids = await generateIds({
			inputFile: PATH_TO_SPRITE,
			outputConstName: config.outputIdsExportedConstName,
			outputDir: config.outputIdsFolder,
			outputFileName: config.outputIdsFileName,
		});
		console.log(`${ids.length} IDs generated`);

		console.log("⚙️ Generating constants...");
		await generateConsts({
			outputDir: config.outputConstsFolder,
			outputFileName: config.outputConstsFileName,
			outputConstName: config.outputConstsExportedConstName,
			cssClassName: config.cssClassName,
			spriteFileName: config.outputSpriteFileName,
			spriteFilePath: PATH_TO_SPRITE,
		});

		console.log("✅ SVG icon sprite generation completed successfully!");
	} catch (error) {
		console.error("❌ Error during sprite generation:", error);
		throw error;
	}
}
