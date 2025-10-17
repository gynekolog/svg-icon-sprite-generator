/**
 * Modifies the SVG file to add the vector-effect="non-scaling-stroke" attribute
 * to the path element.
 */
export async function modifySvg(options: {
	spriteContent: string;
	cssClassName: string;
}) {
	// add vector-effect attribute to path element
	let output = options.spriteContent.replace(
		/<path/g,
		'<path vector-effect="non-scaling-stroke"',
	);
	// replace fill="none" on the <svg /> element by CSS variable
	output = output.replace(
		/fill="none"/g,
		`fill="var(--${options.cssClassName}-fill-svg)"`,
	);
	// replace fill color by CSS variable
	output = output.replace(
		/fill="currentColor"/g,
		`fill="var(--${options.cssClassName}-fill)"`,
	);
	// replace stroke color by CSS variable
	output = output.replace(
		/stroke="currentColor"/g,
		`stroke="var(--${options.cssClassName}-stroke)"`,
	);
	// replace stroke-width by CSS variable
	output = output.replace(
		/stroke-width="([0-9.]*)"/g,
		`stroke-width="var(--${options.cssClassName}-stroke-width)"`,
	);

	return output;
}
