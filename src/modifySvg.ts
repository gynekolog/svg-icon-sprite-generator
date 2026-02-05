import * as cheerio from "cheerio";

/**
 * Modifies the SVG file content
 * - adds/sets the vector-effect="non-scaling-stroke" attribute to all path elements
 * - replaces fill="none", fill="currentColor", stroke="currentColor",
 *   and stroke-width attributes with CSS variables
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

	// add/set vector-effect attribute of path elements to "non-scaling-stroke"
	$("path").attr("vector-effect", "non-scaling-stroke");

	$("*").each((_, el) => {
		// replace fill value "none" with CSS variable
		if ($(el).attr("fill") === "none") {
			$(el).attr("fill", `var(--${options.cssClassName}-fill-svg)`);
		}
		// replace fill value "currentColor" with CSS variable
		if ($(el).attr("fill") === "currentColor") {
			$(el).attr("fill", `var(--${options.cssClassName}-fill)`);
		}
		// replace stroke value "currentColor" with CSS variable
		if ($(el).attr("stroke") === "currentColor") {
			$(el).attr("stroke", `var(--${options.cssClassName}-stroke)`);
		}
		// replace stroke-width values with CSS variable
		if ($(el).attr("stroke-width")) {
			$(el).attr("stroke-width", `var(--${options.cssClassName}-stroke-width)`);
		}
	});

	return $.xml();
}
