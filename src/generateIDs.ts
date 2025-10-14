import type { SvgIconSpriteConfig } from "./types.js";

/**
 * Generate a TypeScript file with all the IDs from an SVG file.
 * Only extracts IDs from <symbol> elements at the top level.
 *
 * @param options - Configuration for generating IDs file
 * @property inputFile - Path to the input SVG file
 * @property outputDir - Directory to write the generated file
 * @property outputConstName - Name of the exported constant
 * @property outputFileName - File name of the generated file
 */
export async function generateIds(
	options: Pick<SvgIconSpriteConfig, "outputIdsExportedConstName"> & {
		spriteContent: string;
	},
) {
	// Match all opening <symbol> tags (ignoring children)
	const symbolTags =
		options.spriteContent.match(/<symbol[\s\S]*?<\/symbol>/g) || [];

	// Array to hold all IDs found in <symbol> elements
	const ids: string[] = [];

	for (const tag of symbolTags) {
		// Extract the 'id' attribute using regex
		const match = tag.match(/id="([^"]+)"/);
		if (!match) continue;

		// Get only the ID value
		const id = match[0].replace(/id="([^"]+)"/, "$1");
		if (!id) continue;

		ids.push(id);
	}

	// Create content of the output file
	let data = "/** Auto-generated file */\n";
	data += `export const ${options.outputIdsExportedConstName} = {\n`;
	data += ids.map((name) => `  "${name}": "${name}",`).join("\n");
	data += "\n} as const;\n";

	return {
		ids,
		fileContent: data,
	};
}
