import fs from "node:fs/promises";
import * as path from "node:path";
import Vinyl from "vinyl";

/**
 * Finds all SVG files in a directory and all subdirectories and returns them as Vinyl objects.
 *
 * @param dir - A directory to search in for SVGs. It may be an absolute or relative path.
 *
 * @throws {Error} If the dir does not exist.
 */
export async function getAllSVGFiles(dir: string) {
	const cwd = path.resolve(dir);

	// throw if the directory does not exist
	await fs.access(cwd);

	const files: Vinyl[] = [];
	const globIterator = fs.glob(path.join(cwd, "**/*.svg"));
	for await (const file of globIterator) {
		files.push(
			new Vinyl({
				cwd,
				path: file,
				contents: await fs.readFile(file),
			}),
		);
	}
	return files;
}
