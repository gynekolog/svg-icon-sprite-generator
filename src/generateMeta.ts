import { generateHashFromSprite } from "./generateHash.js";
import type { SvgIconSpriteConfig } from "./types.js";

export async function generateMeta(
	options: Pick<
		SvgIconSpriteConfig,
		"cssClassName" | "outputSpriteFileName" | "outputMetaExportedConstName"
	> & {
		spriteContent: string;
	},
) {
	const metaObject = {
		className: options.cssClassName,
		spriteFileName: options.outputSpriteFileName,
		hash: generateHashFromSprite(options.spriteContent),
	};

	return {
		fileContent: `/** Auto-generated file */\nexport const ${options.outputMetaExportedConstName} = ${JSON.stringify(metaObject, null, 2)} as const;
`,
	};
}
