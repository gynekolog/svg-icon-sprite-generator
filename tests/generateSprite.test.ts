import path from "node:path";
import { describe, expect, it } from "vitest";
import { generateSprite } from "../src/generateSprite";
import { getAllSVGFiles } from "../src/getAllSVGFiles";

type Options = Parameters<typeof generateSprite>[0];

const INPUT_FOLDER = path.join(__dirname, "./fixtures/icons");
const TMP_FOLDER = path.join(__dirname, "./fixtures/tmp");

describe("generateSprite", () => {
	it("should generate sprite from 4 icons (2 of them in subdirectory)", async () => {
		const inputFiles = await getAllSVGFiles(INPUT_FOLDER);
		const outputSpriteFileName = "test-sprite.svg";
		const options: Options = {
			inputFiles,
			outputSpriteFolder: TMP_FOLDER,
			outputSpriteFileName,
		};

		const spriteContent = await generateSprite(options);

		await expect(spriteContent).toMatchFileSnapshot(
			"./fixtures/snapshots/test-sprite.svg",
		);
	});

	it("should throw when input files array is empty", async () => {
		const outputSpriteFileName = "test-sprite.svg";
		const options: Options = {
			inputFiles: [],
			outputSpriteFolder: TMP_FOLDER,
			outputSpriteFileName,
		};

		await expect(generateSprite(options)).rejects.toThrow();
	});
});
