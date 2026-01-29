import * as cheerio from "cheerio";

/**
 * Modifies the SVG file to add the vector-effect="non-scaling-stroke" attribute
 * to the path element.
 */
export async function modifySvg(options: {
	spriteContent: string;
	cssClassName: string;
}) {
	const $ = cheerio.load(options.spriteContent, {
		xml: {
			decodeEntities: false,
		},
	});

	// add vector-effect attribute to path element
	$("path").attr("vector-effect", "non-scaling-stroke");

	$("*").each((_, el) => {
		// replace fill="none" by CSS variable
		if ($(el).attr("fill") === "none") {
			$(el).attr("fill", `var(--${options.cssClassName}-fill-svg)`);
		}
		// replace fill color by CSS variable
		if ($(el).attr("fill") === "currentColor") {
			$(el).attr("fill", `var(--${options.cssClassName}-fill)`);
		}
		// replace stroke color by CSS variable
		if ($(el).attr("stroke") === "currentColor") {
			$(el).attr("stroke", `var(--${options.cssClassName}-stroke)`);
		}
		// replace stroke-width by CSS variable
		if ($(el).attr("stroke-width")) {
			$(el).attr("stroke-width", `var(--${options.cssClassName}-stroke-width)`);
		}
	});

	return $.xml();
}
