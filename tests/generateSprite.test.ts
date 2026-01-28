import { default as fsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it, onTestFinished } from "vitest";
import { generateSprite } from "../src/generateSprite";

type Options = Parameters<typeof generateSprite>[0];

const INPUT_FOLDER = path.join(__dirname, "./fixtures/icons");
const TMP_FOLDER = path.join(__dirname, "./fixtures/tmp");

describe("generateSprite", () => {
	it("should generate sprite from 4 icons (2 of them in subdirectory)", async () => {
		const outputSpriteFileName = "test-sprite.svg";
		const options: Options = {
			inputFolder: INPUT_FOLDER,
			outputSpriteFolder: TMP_FOLDER,
			outputSpriteFileName,
		};

		const spriteContent = await generateSprite(options);

		await expect(spriteContent).toMatchFileSnapshot(
			"./fixtures/snapshots/test-sprite.svg",
		);
	});

	it("should handle empty input directory", async () => {
		const empty_folder = path.join(__dirname, "./fixtures/empty");
		if (fsSync.existsSync(empty_folder)) {
			await fs.rmdir(empty_folder);
		}
		await fs.mkdir(empty_folder);
		onTestFinished(() => fs.rmdir(empty_folder));

		const outputSpriteFileName = "test-sprite.svg";
		const options: Options = {
			inputFolder: empty_folder,
			outputSpriteFolder: TMP_FOLDER,
			outputSpriteFileName,
		};

		const spriteContent = await generateSprite(options);

		expect(spriteContent).toBe(
			'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"></svg>',
		);
	});

	it("should throw when input folder doesn't exist", async () => {
		const outputSpriteFileName = "test-sprite.svg";
		const options: Options = {
			inputFolder: path.join(__dirname, "./fixtures/non-existent"),
			outputSpriteFolder: TMP_FOLDER,
			outputSpriteFileName,
		};

		await expect(generateSprite(options)).rejects.toThrow();
	});
});
