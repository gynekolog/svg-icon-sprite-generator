import { describe, expect, it } from "vitest";
import { generateIds } from "../src/generateIDs";

type Options = Parameters<typeof generateIds>[0];

describe("generateIds", () => {
	it("should generate expected IDs", async () => {
		const spriteContent = `
		<svg>
			<symbol id="user">
				<path id="user-path" />
			</symbol>
			<symbol id="chevron-left">
			</symbol>
		</svg>`;
		const outputIdsExportedConstName = "testIcons";
		const options: Options = {
			outputIdsExportedConstName,
			spriteContent,
		};

		const result = await generateIds(options);

		expect(result.ids).toContain("user");
		expect(result.ids).toContain("chevron-left");
		expect(result.ids).not.toContain("user-path");

		const matches = result.fileContent.match(
			new RegExp(`export const ${outputIdsExportedConstName} = {(.*)}`, "s"),
		);
		if (!matches) {
			throw new Error("Invalid ids file content: no matches found");
		}
		const outputConst = matches[1];

		expect(outputConst).toMatch("user");
		expect(outputConst).toMatch("chevron-left");
		expect(outputConst).not.toMatch("user-path");
	});
});
