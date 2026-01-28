import { describe, expect, it } from "vitest";
import { modifySvg } from "../src/modifySvg";

type Options = Parameters<typeof modifySvg>[0];

describe("modifySvg", () => {
	it("should add vector-effect attribute to path element", async () => {
		const spriteContent = "<svg><path></path></svg>";
		const cssClassName = "test-icon";
		const options: Options = {
			spriteContent,
			cssClassName,
		};

		const result = await modifySvg(options);

		expect(result).toBe(
			'<svg><path vector-effect="non-scaling-stroke"></path></svg>',
		);
	});

	it('should replace fill="none" by CSS variable', async () => {
		const spriteContent = '<svg><symbol fill="none"></symbol></svg>';
		const cssClassName = "test-icon";
		const options: Options = {
			spriteContent,
			cssClassName,
		};

		const result = await modifySvg(options);

		expect(result).toBe(
			`<svg><symbol fill="var(--${cssClassName}-fill-svg)"></symbol></svg>`,
		);
	});

	it("should replace fill color by CSS variable", async () => {
		const spriteContent = '<svg><symbol fill="currentColor"></symbol></svg>';
		const cssClassName = "test-icon";
		const options: Options = {
			spriteContent,
			cssClassName,
		};

		const result = await modifySvg(options);

		expect(result).toBe(
			`<svg><symbol fill="var(--${cssClassName}-fill)"></symbol></svg>`,
		);
	});

	it("should replace stroke color by CSS variable", async () => {
		const spriteContent = '<svg><symbol stroke="currentColor"></symbol></svg>';
		const cssClassName = "test-icon";
		const options: Options = {
			spriteContent,
			cssClassName,
		};

		const result = await modifySvg(options);

		expect(result).toBe(
			`<svg><symbol stroke="var(--${cssClassName}-stroke)"></symbol></svg>`,
		);
	});

	it("should replace stroke-width by CSS variable", async () => {
		const spriteContent = '<svg><symbol stroke-width="12"></symbol></svg>';
		const cssClassName = "test-icon";
		const options: Options = {
			spriteContent,
			cssClassName,
		};

		const result = await modifySvg(options);

		expect(result).toBe(
			`<svg><symbol stroke-width="var(--${cssClassName}-stroke-width)"></symbol></svg>`,
		);
	});
});
