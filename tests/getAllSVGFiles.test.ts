import { default as fsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it, onTestFinished } from "vitest";
import { getAllSVGFiles } from "../src/getAllSVGFiles";

const INPUT_FOLDER = path.join(__dirname, "./fixtures/icons");

describe("getAllSVGFiles", () => {
	it("should find all SVG files in directory and its subdirectories", async () => {
		const result = await getAllSVGFiles(INPUT_FOLDER);

		expect(result).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					relative: "my-awesome_icon.svg",
					contents: expect.anything(),
				}),
				expect.objectContaining({
					relative: "user.svg",
					contents: expect.anything(),
				}),
				expect.objectContaining({
					relative: "hero-pack/arrow-left.svg",
					contents: expect.anything(),
				}),
				expect.objectContaining({
					relative: "hero-pack/home.svg",
					contents: expect.anything(),
				}),
			]),
		);
		expect(result).toEqual(
			expect.not.arrayContaining([
				expect.objectContaining({
					relative: "not-icon.txt",
				}),
			]),
		);
	});

	it("should handle empty directory", async () => {
		const emptyDir = path.join(__dirname, "./fixtures/empty");
		if (fsSync.existsSync(emptyDir)) {
			await fs.rmdir(emptyDir);
		}
		await fs.mkdir(emptyDir);
		onTestFinished(() => fs.rmdir(emptyDir));

		const result = await getAllSVGFiles(emptyDir);

		expect(result).toHaveLength(0);
	});

	it("should throw when directory doesn't exist", async () => {
		const nonExistentDir = path.join(__dirname, "./fixtures/non-existent");

		await expect(getAllSVGFiles(nonExistentDir)).rejects.toThrow();
	});
});
