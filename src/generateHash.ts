import * as crypto from "node:crypto";
import * as fs from "node:fs";

/**
 * Generates a deterministic hash from the SVG sprite file content
 * Same content will always produce the same hash
 */
export function generateHashFromSprite(spriteFilePath: string): string {
	if (!fs.existsSync(spriteFilePath)) {
		throw new Error(`Sprite file not found: ${spriteFilePath}`);
	}

	const spriteContent = fs.readFileSync(spriteFilePath, "utf8");
	const hash = crypto
		.createHash("sha256")
		.update(spriteContent)
		.digest("hex")
		.substring(0, 8);

	return hash;
}
