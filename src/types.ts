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

	/** Output folder for the meta file */
	outputMetaFolder: string;
	/** Name of the generated meta file */
	outputMetaFileName: string;
	/** Name of the exported constant in the meta file */
	outputMetaExportedConstName: string;

	/** CSS class name for the icons */
	cssClassName: string;
}
