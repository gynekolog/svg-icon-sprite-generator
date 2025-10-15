import { describe, expect, it } from "vitest";
import { generateHashFromSprite } from "../src/generateHash.js";

describe("generateHashFromSprite", () => {
	it("should generate consistent hash for same content", () => {
		const content = '<svg><circle r="10"/></svg>';

		const hash1 = generateHashFromSprite(content);
		const hash2 = generateHashFromSprite(content);

		expect(hash1).toBe(hash2);
		expect(hash1).toHaveLength(8);
		expect(typeof hash1).toBe("string");
	});

	it("should generate different hashes for different content", () => {
		const content1 = '<svg><circle r="10"/></svg>';
		const content2 = '<svg><circle r="20"/></svg>';

		const hash1 = generateHashFromSprite(content1);
		const hash2 = generateHashFromSprite(content2);

		expect(hash1).not.toBe(hash2);
		expect(hash1).toHaveLength(8);
		expect(hash2).toHaveLength(8);
	});

	it("should generate 8-character hexadecimal hash", () => {
		const content = '<svg><rect width="100" height="100"/></svg>';

		const hash = generateHashFromSprite(content);

		expect(hash).toMatch(/^[a-f0-9]{8}$/);
		expect(hash).toHaveLength(8);
	});

	it("should handle empty content", () => {
		const content = "";

		const hash = generateHashFromSprite(content);

		expect(hash).toHaveLength(8);
		expect(hash).toMatch(/^[a-f0-9]{8}$/);
	});
});
