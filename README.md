# svg-icon-sprite-generator

A TypeScript package for generating SVG icon sprites with automatic ID generation, configuration constants, and content-based hashing.

## Features

- 🎨 Generate SVG sprites from individual icon files
- 🔤 Automatic TypeScript ID generation for type safety
- ⚙️ Configuration constants with deterministic hashing
- 🚀 CLI tool and programmatic API
- 📦 TypeScript support with full type definitions
- 🎯 Configurable via CLI arguments

## Installation

```bash
npm install svg-icon-sprite-generator
# or
yarn add svg-icon-sprite-generator
# or
pnpm add svg-icon-sprite-generator
```

## Quick Start

1. **Add SVG files** to your icons folder

2. **Run the generator** with required arguments:

```bash
# Basic usage (only inputFolder and outputSpriteFolder are required)
npx svg-icon-sprite-generator \
  --inputFolder ./icons \
  --outputSpriteFolder ./build

# With separate output folders for different file types
npx svg-icon-sprite-generator \
  --inputFolder ./icons \
  --outputSpriteFolder ./dist \
  --outputIdsFolder ./types \
  --outputConstsFolder ./config

# Full customization
npx svg-icon-sprite-generator \
  --inputFolder ./icons \
  --outputSpriteFolder ./dist \
  --outputIdsFolder ./types \
  --outputConstsFolder ./config \
  --outputSpriteFileName my-icons.svg \
  --cssClassName my-icon

# Add to your package.json scripts
{
  "scripts": {
    "build:icons": "svg-icon-sprite-generator --inputFolder ./icons --outputSpriteFolder ./build"
  }
}
```

## Generated Files

The generator creates three files:

### 1. SVG Sprite (`icons-sprite.svg`)
Contains all your icons as symbols in a single SVG file.

### 2. TypeScript IDs (`icons.generated.ts`)
```typescript
export const icons = {
  "arrow-left": "arrow-left",
  "arrow-right": "arrow-right",
  "home": "home"
} as const;
```

### 3. Configuration Constants (`icons-config.generated.ts`)
```typescript
export const iconConsts = {
  "className": "ui-icon",
  "spriteFileName": "icons-sprite.svg",
  "hash": "a1b2c3d4"
} as const;
```

## Usage in React

```tsx
import clsx from "clsx";
import type { JSX } from "react";
import type { icons } from "./build/icons.generated.js";
import { iconConsts } from "./build/icons-config.generated.js";

type IconType = keyof typeof icons;
type IconProps = Omit<JSX.IntrinsicElements["svg"], "role" | "children"> & {
	icon: IconType;
};

const Icon = ({ icon, className, ...rest }: IconProps) => (
	<svg
		{...rest}
		className={clsx(iconConsts.className, className)}
	>
		<use href={`/assets/${iconConsts.spriteFileName}?v=${iconConsts.hash}#${icon}`} />
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

Optional:
  --outputIdsFolder                Output folder for IDs file (defaults to outputSpriteFolder)
  --outputConstsFolder             Output folder for constants file (defaults to outputSpriteFolder)
  --outputSpriteFileName           Name of generated sprite file (default: "icons-sprite.svg")
  --outputIdsFileName              Name of generated IDs file (default: "icons.generated.ts")
  --outputIdsExportedConstName     Name of exported constant in IDs file (default: "icons")
  --outputConstsFileName           Name of generated constants file (default: "icons-config.generated.ts")
  --outputConstsExportedConstName  Name of exported constant in constants file (default: "iconConsts")
  --cssClassName                   CSS class name for icons and CSS variables prefix (default: "ui-icon")
  -v, --verbose                    Verbose output
  -h, --help                       Show help
```

## Programmatic API

```typescript
import { runGenerator, DEFAULT_CONFIG } from "svg-icon-sprite-generator";

// Only inputFolder and outputSpriteFolder are required
await runGenerator({
	inputFolder: "./my-icons",
	outputSpriteFolder: "./dist",
	// outputIdsFolder and outputConstsFolder will default to outputSpriteFolder
	// Optional: override defaults
	outputSpriteFileName: "my-sprite.svg",
	cssClassName: "my-icon",
	// Use defaults for other options
	...DEFAULT_CONFIG,
});

// Or build config with defaults and custom folders
const config = {
	...DEFAULT_CONFIG,
	// Required
	inputFolder: "./my-icons",
	outputSpriteFolder: "./dist",
	// Optional: separate folders for different file types
	outputIdsFolder: "./types",
	outputConstsFolder: "./config",
	// Optional overrides
	cssClassName: "my-icon",
};

await runGenerator(config);
```

## Configuration Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `inputFolder` | `string` | ✅ | - | Folder containing SVG files |
| `outputSpriteFolder` | `string` | ✅ | - | Output folder for sprite file |
| `outputIdsFolder` | `string` | ❌ | `outputSpriteFolder` | Output folder for IDs file |
| `outputConstsFolder` | `string` | ❌ | `outputSpriteFolder` | Output folder for constants file |
| `outputSpriteFileName` | `string` | ❌ | `"icons-sprite.svg"` | Name of generated sprite file |
| `outputIdsFileName` | `string` | ❌ | `"icons.generated.ts"` | Name of generated IDs file |
| `outputIdsExportedConstName` | `string` | ❌ | `"icons"` | Name of exported constant in IDs file |
| `outputConstsFileName` | `string` | ❌ | `"icons-config.generated.ts"` | Name of generated constants file |
| `outputConstsExportedConstName` | `string` | ❌ | `"iconConsts"` | Name of exported constant in constants file |
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
