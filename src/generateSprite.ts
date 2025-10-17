import * as fs from "node:fs";
import * as path from "node:path";
import SVGSpriter from "svg-sprite";
import type { SvgIconSpriteConfig } from "./types.js";

// Recursively find all SVG files in a directory
function getAllSVGFiles(dir: string, fileList: string[] = []) {
	const files = fs.readdirSync(dir);

	for (let i = 0; i < files.length; i++) {
		const filePath = path.join(dir, files[i]);
		const stat = fs.statSync(filePath);

		if (stat.isDirectory()) {
			getAllSVGFiles(filePath, fileList);
		} else if (path.extname(files[i]) === ".svg") {
			fileList.push(filePath);
		}
	}

	return fileList;
}

export async function generateSprite(
	config: Pick<
		SvgIconSpriteConfig,
		"inputFolder" | "outputSpriteFolder" | "outputSpriteFileName"
	>,
) {
	const INPUT_DIR = path.relative(process.cwd(), config.inputFolder);
	const spriter = new SVGSpriter({
		svg: {
			namespaceClassnames: false,
		},
		log: "verbose",
		shape: {
			id: {
				separator: "--",
			},
			transform: [
				{
					svgo: {
						// @ts-expect-error: The syntax is valid: https://github.com/svg-sprite/svg-sprite/blob/main/docs/configuration.md#custom-callback-transformation-function-values
						plugins: [
							{
								name: "preset-default",
							},
							{
								name: "convertColors",
								params: {
									currentColor: true,
								},
							},
						],
					},
				},
			],
		},

		mode: {
			symbol: {
				dest: config.outputSpriteFolder,
				sprite: config.outputSpriteFileName,
			},
		},
	});

	// Get all SVG files in the icons directory
	const files = getAllSVGFiles(INPUT_DIR);

	// Add all SVG files to the spriter
	for (const file of files) {
		// Add the file to the spriter.
		// Use relative path as the id. For example, crops/barley.svg -> "crops--barley".
		// The separator is defined in the shape config.
		// @see https://github.com/svg-sprite/svg-sprite/blob/main/docs/api.md#svgspriteraddfile--name-svg-
		const relPath = path.relative(INPUT_DIR, file);
		spriter.add(file, relPath, fs.readFileSync(file, "utf-8"));
	}

	{
		const { result } = await spriter.compileAsync();

		if (!result.symbol) {
			throw new Error(
				"The spriter output doesn't contain the symbol output mode.",
			);
		}
		if (!result.symbol.sprite) {
			throw new Error(
				"The symbol output mode doesn't contain the sprite resource.",
			);
		}

		const contents = result.symbol.sprite.contents;
		if (!(contents instanceof Buffer)) {
			throw new Error("Unexpected contents of the symbol output mode sprite.");
		}

		return contents.toString("utf8");
	}
}
