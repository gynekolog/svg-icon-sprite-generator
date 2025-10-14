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

export async function generateSprite(config: SvgIconSpriteConfig) {
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
		/*
		 * compileAsync returns a Promise but the type definitions are "any".
		 * Implementation follows the documentation: https://github.com/svg-sprite/svg-sprite?tab=readme-ov-file#usage-pattern
		 * */
		const _result = result as Record<
			string,
			Record<
				string,
				{
					path: string;
					contents: NodeJS.ArrayBufferView;
				}
			>
		>;
		for (const mode of Object.values(_result)) {
			for (const resource of Object.values(mode)) {
				fs.mkdirSync(path.dirname(resource.path), { recursive: true });
				fs.writeFileSync(resource.path, resource.contents);
			}
		}
	}
}
