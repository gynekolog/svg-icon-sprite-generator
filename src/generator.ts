import fs from "node:fs";
import * as path from "node:path";
import { generateIds } from "./generateIDs.js";
import { generateMeta } from "./generateMeta.js";
import { generateSprite } from "./generateSprite.js";
import { modifySvg } from "./modifySvg.js";
import type { SvgIconSpriteConfig } from "./types.js";

/**
 * Main generator function that orchestrates the entire sprite generation process
 */
export async function runGenerator(config: SvgIconSpriteConfig): Promise<void> {
	console.log("🚀 Starting SVG icon sprite generation...");

	try {
		console.log("📦 Generating sprite...");
		let spriteContent = await generateSprite(config);

		console.log("🎨 Modifying SVG...");
		spriteContent = await modifySvg({
			spriteContent,
			cssClassName: config.cssClassName,
		});

		/* write the modified SVG to the output folder */
		const outputSpritePath = path.resolve(
			config.outputSpriteFolder,
			config.outputSpriteFileName,
		);
		await fs.promises.writeFile(outputSpritePath, spriteContent, "utf8");

		console.log("🔤 Generating IDs...");
		const generateIdsResult = await generateIds({
			spriteContent,
			outputIdsExportedConstName: config.outputIdsExportedConstName,
		});

		/* write ids file */
		const outputIdsPath = path.resolve(
			config.outputIdsFolder,
			config.outputIdsFileName,
		);
		await fs.promises.writeFile(
			outputIdsPath,
			generateIdsResult.fileContent,
			"utf8",
		);
		console.log(`${generateIdsResult.ids.length} IDs generated`);

		console.log("⚙️ Generating constants...");
		const generateMetaResult = await generateMeta({
			spriteContent,
			outputSpriteFileName: config.outputSpriteFileName,
			outputMetaFileName: config.outputMetaFileName,
			outputMetaExportedConstName: config.outputMetaExportedConstName,
			cssClassName: config.cssClassName,
		});

		/* write meta file */
		const outputMetaFilePath = path.resolve(
			config.outputMetaFolder,
			config.outputMetaFileName,
		);
		await fs.promises.writeFile(
			outputMetaFilePath,
			generateMetaResult.fileContent,
			"utf8",
		);

		console.log("✅ SVG icon sprite generation completed successfully!");
	} catch (error) {
		console.error("❌ Error during sprite generation:", error);
		throw error;
	}
}
