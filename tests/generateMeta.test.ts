import { describe, expect, it } from "vitest";
import { generateMeta } from "../src/generateMeta";

type Options = Parameters<typeof generateMeta>[0];

describe("generateMeta", () => {
	it("should generate expected meta", async () => {
		const cssClassName = "test-icon";
		const outputSpriteFileName = "test-sprite.svg";
		const outputMetaExportedConstName = "testSpriteMeta";
		const spriteContent = "<svg></svg>";
		const options: Options = {
			cssClassName,
			outputSpriteFileName,
			outputMetaExportedConstName,
			spriteContent,
		};

		const result = await generateMeta(options);

		const matches = result.fileContent.match(
			new RegExp(
				`export const ${outputMetaExportedConstName} = (.*) as const`,
				"s",
			),
		);
		if (!matches) {
			throw new Error("Invalid meta file content: no matches found");
		}
		const outputConst = JSON.parse(matches[1]);

		expect(outputConst.className).toBe(cssClassName);
		expect(outputConst.spriteFileName).toBe(outputSpriteFileName);
		expect(outputConst.hash).toBeTypeOf("string");
	});
});
