import type { SvgIconSpriteConfig } from "./types.js";

export const DEFAULT_CONFIG = {
	outputSpriteFileName: "icons-sprite.svg",

	outputIdsFileName: "icons.generated.ts",
	outputIdsExportedConstName: "icons",

	outputConstsFileName: "icons-consts.generated.ts",
	outputConstsExportedConstName: "iconConsts",

	cssClassName: "ui-icon",
} satisfies Partial<SvgIconSpriteConfig>;
