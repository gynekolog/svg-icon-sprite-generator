import * as crypto from "node:crypto";

/**
 * Generates a deterministic hash from the SVG sprite file content
 * Same content will always produce the same hash
 */
export function generateHashFromSprite(spriteContent: string): string {
	const hash = crypto
		.createHash("sha256")
		.update(spriteContent)
		.digest("hex")
		.substring(0, 8);

	return hash;
}
