import SVGSpriter from "svg-sprite";
import type Vinyl from "vinyl";
import type { SvgIconSpriteConfig } from "./types.js";

export async function generateSprite(
	config: Pick<
		SvgIconSpriteConfig,
		"outputSpriteFolder" | "outputSpriteFileName"
	> & {
		/**
		 * Array of SVG file Vinyl objects to be included in the sprite.
		 * Their relative path will be used as the id. For example, crops/barley.svg -> "crops--barley".
		 */
		inputFiles: Vinyl[];
	},
) {
	if (config.inputFiles.length === 0) {
		throw new Error("No input files.");
	}

	const spriter = new SVGSpriter({
		svg: {
			namespaceClassnames: false,
		},
		log: "verbose",
		shape: {
			id: {
				// Separator used for ids. For example, crops/barley.svg -> "crops--barley"
				// @see https://github.com/svg-sprite/svg-sprite/blob/main/docs/api.md#svgspriteraddfile--name-svg-
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

	// Add all SVG files to the spriter
	for (const file of config.inputFiles) {
		spriter.add(file);
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
