import type { SvgIconSpriteConfig } from "./types.js";

export const DEFAULT_CONFIG = {
	outputSpriteFileName: "icon-sprite.svg",

	outputIdsFileName: "icon-sprite-ids.generated.ts",
	outputIdsExportedConstName: "icons",

	outputMetaFileName: "icon-sprite-meta.generated.ts",
	outputMetaExportedConstName: "iconSpriteMeta",

	cssClassName: "ui-icon",
} satisfies Partial<SvgIconSpriteConfig>;
