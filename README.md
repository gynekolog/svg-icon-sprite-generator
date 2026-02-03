# svg-icon-sprite-generator

A TypeScript package for generating SVG icon sprites with automatic ID generation, configuration constants, and content-based hashing.

## Features

- Generate SVG sprites from individual icon files
- Automatic TypeScript ID generation for type safety
- Configuration constants with deterministic hashing
- Configurable via CLI arguments

## Quick Start

```bash
# Basic usage (inputFolder, outputSpriteFolder, and outputIdsFolder are required)
npx svg-icon-sprite-generator \
  --inputFolder ./icons \
  --outputSpriteFolder ./build \
  --outputIdsFolder ./build

# With separate output folders for different file types
npx svg-icon-sprite-generator \
  --inputFolder ./icons \
  --outputSpriteFolder ./dist \
  --outputIdsFolder ./types \
  --outputMetaFolder ./config

# Full customization
npx svg-icon-sprite-generator \
  --inputFolder ./icons \
  --outputSpriteFolder ./dist \
  --outputIdsFolder ./types \
  --outputMetaFolder ./config \
  --outputSpriteFileName my-icons.svg \
  --cssClassName my-icon

# Add to your package.json scripts
{
  "scripts": {
    "build:icons": "svg-icon-sprite-generator --inputFolder=./icons --outputSpriteFolder=./public --outputIdsFolder=./src/components/Icon"
  }
}
```

## Generated Files

The generator creates three files:

### 1. SVG Sprite (`icon-sprite.svg`)
Contains all your icons as symbols in a single SVG file.

### 2. TypeScript IDs (`icon-sprite-ids.generated.ts`)
```typescript
export const icons = {
  "arrow-left": "arrow-left",
  "arrow-right": "arrow-right",
  "home": "home"
} as const;
```

### 3. Configuration Meta (`icon-sprite-meta.generated.ts`)
```typescript
export const iconMeta = {
  "className": "ui-icon",
  "spriteFileName": "icon-sprite.svg",
  "hash": "a1b2c3d4"
} as const;
```

## Usage in React

```tsx
import clsx from "clsx";
import type { JSX } from "react";
import type { icons } from "./icons.generated";
import { iconMeta } from "./icons-meta.generated";

type IconType = keyof typeof icons;
type IconProps = Omit<JSX.IntrinsicElements["svg"], "role" | "children"> & {
	icon: IconType;
};

const Icon = ({ icon, className, ...rest }: IconProps) => (
	<svg
		{...rest}
		className={clsx(iconMeta.className, className)}
	>
		<use href={`/assets/${iconMeta.spriteFileName}?v=${iconMeta.hash}#${icon}`} />
	</svg>
);

// Usage
<Icon icon="home" width="24" height="24" />
```

## CLI Options

```bash
svg-icon-sprite-generator [required options] [optional options]

Required:
  --inputFolder                    Folder containing SVG files
  --outputSpriteFolder             Output folder for sprite file
  --outputIdsFolder                Output folder for IDs file

Optional:
  --outputMetaFolder               Output folder for meta file (defaults to outputIdsFolder)
  --outputSpriteFileName           Name of generated sprite file (default: "icon-sprite.svg")
  --outputIdsFileName              Name of generated IDs file (default: "icon-sprite-ids.generated.ts")
  --outputIdsExportedConstName     Name of exported constant in IDs file (default: "icons")
  --outputMetaFileName             Name of generated meta file (default: "icon-sprite-meta.generated.ts")
  --outputMetaExportedConstName    Name of exported constant in meta file (default: "iconMeta")
  --cssClassName                   CSS class name for icons and CSS variables prefix (default: "ui-icon")
  -v, --verbose                    Verbose output
  -h, --help                       Show help
```

## Programmatic API

```typescript
import { runGenerator, DEFAULT_CONFIG } from "svg-icon-sprite-generator";

await runGenerator({
	...DEFAULT_CONFIG,
	// Required
	inputFolder: "./icons",
	outputSpriteFolder: "./build",
	outputIdsFolder: "./build",
	outputMetaFolder: "./build",
	// Optional overrides
	cssClassName: "my-icon",
});
```

## Configuration Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `inputFolder` | `string` | ✅ | - | Folder containing SVG files |
| `outputSpriteFolder` | `string` | ✅ | - | Output folder for sprite file |
| `outputIdsFolder` | `string` | ✅ | - | Output folder for IDs file |
| `outputMetaFolder` | `string` | ❌ | `outputIdsFolder` | Output folder for meta file |
| `outputSpriteFileName` | `string` | ❌ | `"icon-sprite.svg"` | Name of generated sprite file |
| `outputIdsFileName` | `string` | ❌ | `"icon-sprite-ids.generated.ts"` | Name of generated IDs file |
| `outputIdsExportedConstName` | `string` | ❌ | `"icons"` | Name of exported constant in IDs file |
| `outputMetaFileName` | `string` | ❌ | `"icon-sprite-meta.generated.ts"` | Name of generated meta file |
| `outputMetaExportedConstName` | `string` | ❌ | `"iconMeta"` | Name of exported constant in meta file |
| `cssClassName` | `string` | ❌ | `"ui-icon"` | CSS class name for icons and CSS variables prefix |

## CSS Setup

The `cssClassName` is used both as the CSS class name and as the prefix for CSS variables:

```css
.ui-icon {
    --ui-icon-size: 1em;
    --ui-icon-fill: currentColor;
    --ui-icon-stroke: currentColor;
    --ui-icon-stroke-width: inherit;

    width: var(--ui-icon-size);
    height: var(--ui-icon-size);
    flex-shrink: 0;
    stroke-width: 2;
}
```

If you use a custom `cssClassName` like `my-icon`, the CSS variables will be prefixed accordingly:

```css
.my-icon {
    --my-icon-size: 1em;
    --my-icon-fill: currentColor;
    --my-icon-stroke: currentColor;
    --my-icon-stroke-width: inherit;

    width: var(--my-icon-size);
    height: var(--my-icon-size);
    flex-shrink: 0;
    stroke-width: 2;
}
```

## Hash-based Cache Busting

- Hash changes only when sprite content changes
- Same content = same hash (deterministic)
- No cache files needed

## License

MIT
