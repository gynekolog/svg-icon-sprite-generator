import * as fs from "node:fs";
import * as path from "node:path";
import { generateHashFromSprite } from "./generateHash.js";

interface GenerateConfigOptions {
	outputDir: string;
	outputFileName: string;
	outputConstName: string;
	cssClassName: string;
	spriteFileName: string;
	spriteFilePath: string;
}

export async function generateMeta(
	options: GenerateConfigOptions,
): Promise<void> {
	const {
		outputDir,
		outputFileName,
		outputConstName,
		cssClassName,
		spriteFileName,
		spriteFilePath,
	} = options;

	// Generate deterministic hash from sprite content
	const hash = generateHashFromSprite(spriteFilePath);

	const configObject = {
		className: cssClassName,
		spriteFileName: spriteFileName,
		hash: hash,
	};

	const fileContent = `/** Auto-generated file */\nexport const ${outputConstName} = ${JSON.stringify(configObject, null, 2)} as const;
`;

	// Ensure output directory exists
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}

	const outputPath = path.resolve(outputDir, outputFileName);

	await fs.promises.writeFile(outputPath, fileContent, "utf8");
}
