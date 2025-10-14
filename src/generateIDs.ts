import * as fs from "node:fs/promises";
import * as path from "node:path";

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
export async function generateIds(options: {
	inputFile: string;
	outputDir: string;
	outputConstName: string;
	outputFileName: string;
}) {
	const { inputFile, outputDir, outputConstName, outputFileName } = options;

	const content = await fs.readFile(inputFile, "utf8");

	// Match all opening <symbol> tags (ignoring children)
	const symbolTags = content.match(/<symbol[\s\S]*?<\/symbol>/g) || [];

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

	const outputPath = path.resolve(outputDir, outputFileName);

	// Create content of the output file
	let data = "/** Auto-generated file */\n";
	data += `export const ${outputConstName} = {\n`;
	data += ids.map((name) => `  "${name}": "${name}",`).join("\n");
	data += "\n} as const;\n";

	// write content
	await fs.writeFile(outputPath, data);

	return ids;
}
