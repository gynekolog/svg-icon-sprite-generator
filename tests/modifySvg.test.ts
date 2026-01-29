import { describe, expect, it } from "vitest";
import { modifySvg } from "../src/modifySvg";

type Options = Parameters<typeof modifySvg>[0];

describe("modifySvg", () => {
	it("should add vector-effect attribute to path element", async () => {
		const spriteContent1 = "<svg><path /></svg>";
		const spriteContent2 = '<svg><path d="..."/></svg>';
		const spriteContent3 =
			'<svg><path d="..." vector-effect="non-scaling-stroke" fill="green"/></svg>';
		const spriteContent4 =
			'<svg><path d="..." vector-effect="none" fill="green"/></svg>';
		const cssClassName = "test-icon";

		const result1 = await modifySvg({
			spriteContent: spriteContent1,
			cssClassName,
		});
		const result2 = await modifySvg({
			spriteContent: spriteContent2,
			cssClassName,
		});
		const result3 = await modifySvg({
			spriteContent: spriteContent3,
			cssClassName,
		});
		const result4 = await modifySvg({
			spriteContent: spriteContent4,
			cssClassName,
		});

		expect(result1).toMatchInlineSnapshot(
			`"<svg><path vector-effect="non-scaling-stroke" /></svg>"`,
		);
		expect(result2).toMatchInlineSnapshot(
			`"<svg><path vector-effect="non-scaling-stroke" d="..."/></svg>"`,
		);
		expect(result3).toMatchInlineSnapshot(
			`"<svg><path d="..." vector-effect="non-scaling-stroke" fill="green"/></svg>"`,
		);
		expect(result4).toMatchInlineSnapshot(
			`"<svg><path d="..." vector-effect="non-scaling-stroke" fill="green"/></svg>"`,
		);
	});

	it('should replace fill="none" by CSS variable', async () => {
		const spriteContent = '<svg><symbol fill="none"/></svg>';
		const cssClassName = "test-icon";
		const options: Options = {
			spriteContent,
			cssClassName,
		};

		const result = await modifySvg(options);

		expect(result).toBe(
			`<svg><symbol fill="var(--${cssClassName}-fill-svg)"/></svg>`,
		);
	});

	it("should replace fill color by CSS variable", async () => {
		const spriteContent = '<svg><symbol fill="currentColor"/></svg>';
		const cssClassName = "test-icon";
		const options: Options = {
			spriteContent,
			cssClassName,
		};

		const result = await modifySvg(options);

		expect(result).toBe(
			`<svg><symbol fill="var(--${cssClassName}-fill)"/></svg>`,
		);
	});

	it("should replace stroke color by CSS variable", async () => {
		const spriteContent = '<svg><symbol stroke="currentColor"/></svg>';
		const cssClassName = "test-icon";
		const options: Options = {
			spriteContent,
			cssClassName,
		};

		const result = await modifySvg(options);

		expect(result).toBe(
			`<svg><symbol stroke="var(--${cssClassName}-stroke)"/></svg>`,
		);
	});

	it("should replace stroke-width by CSS variable", async () => {
		const spriteContent1 = '<svg><symbol stroke-width="12"/></svg>';
		const spriteContent2 = '<svg><symbol stroke-width="12px"/></svg>';
		const spriteContent3 = '<svg><symbol stroke-width="12%"/></svg>';
		const cssClassName = "test-icon";

		const result1 = await modifySvg({
			spriteContent: spriteContent1,
			cssClassName,
		});
		const result2 = await modifySvg({
			spriteContent: spriteContent2,
			cssClassName,
		});
		const result3 = await modifySvg({
			spriteContent: spriteContent3,
			cssClassName,
		});

		const expectedResult = `<svg><symbol stroke-width="var(--${cssClassName}-stroke-width)"/></svg>`;
		expect(result1).toBe(expectedResult);
		expect(result2).toBe(expectedResult);
		expect(result3).toBe(expectedResult);
	});

	it("should not modify any text content", async () => {
		const spriteContent = `<svg><symbol><desc>
			vector-effect="none"
			fill="none"
			fill="currentColor"
			stroke="currentColor"
			stroke-width="12"
		</desc></symbol></svg>`;
		const cssClassName = "test-icon";
		const options: Options = {
			spriteContent,
			cssClassName,
		};

		const result = await modifySvg(options);

		expect(result).toBe(spriteContent);
	});
});
