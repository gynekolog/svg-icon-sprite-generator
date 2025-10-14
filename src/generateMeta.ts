import { generateHashFromSprite } from "./generateHash.js";
import type { SvgIconSpriteConfig } from "./types.js";

export async function generateMeta(
	options: Pick<
		SvgIconSpriteConfig,
		| "outputMetaFileName"
		| "cssClassName"
		| "outputSpriteFileName"
		| "outputMetaExportedConstName"
	> & {
		spriteContent: string;
	},
) {
	// Generate deterministic hash from sprite content
	const hash = generateHashFromSprite(options.spriteContent);

	const metaObject = {
		className: options.cssClassName,
		spriteFileName: options.outputSpriteFileName,
		hash: hash,
	};

	return {
		fileContent: `/** Auto-generated file */\nexport const ${options.outputMetaExportedConstName} = ${JSON.stringify(metaObject, null, 2)} as const;
`,
	};
}
