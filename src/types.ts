export interface SvgIconSpriteConfig {
	/** Input folder containing SVG files */
	inputFolder: string;

	/** Output folder for the sprite file */
	outputSpriteFolder: string;
	/** Name of the generated sprite file */
	outputSpriteFileName: string;

	/** Output folder for the IDs file */
	outputIdsFolder: string;
	/** Name of the generated IDs file */
	outputIdsFileName: string;
	/** Name of the exported constant in the IDs file */
	outputIdsExportedConstName: string;

	/** Output folder for the constants file */
	outputConstsFolder: string;
	/** Name of the generated constants file */
	outputConstsFileName: string;
	/** Name of the exported constant in the constants file */
	outputConstsExportedConstName: string;

	/** CSS class name for the icons */
	cssClassName: string;
}
