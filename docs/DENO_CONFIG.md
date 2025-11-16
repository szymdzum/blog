# Deno Configuration Documentation

**Repository:** Kumak's Blog (Astro + Deno)  
**Deno Version:** 2.x  
**Configuration Date:** November 16, 2025

## Overview

This project uses Deno 2.x as the primary runtime with npm for dependency management. Astro requires npm packages, so we use `node_modules/` for build-time dependencies while leveraging JSR for Deno-native imports.

## Dependency Management

### Why npm install?

Astro and its ecosystem are npm-based. The project uses:

```bash
npm install  # For Astro and build tools
```

**Production:** The site is fully static with zero runtime dependencies.

## Configuration Highlights

### TypeScript (compilerOptions)

**Maximum Strictness:**

```json
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true,
  "strictFunctionTypes": true,
  "strictBindCallApply": true,
  "strictPropertyInitialization": true,
  "noImplicitThis": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noImplicitReturns": true,
  "noFallthroughCasesInSwitch": true,
  "noUncheckedIndexedAccess": true,
  "noImplicitOverride": true,
  "exactOptionalPropertyTypes": true,
  "allowUnusedLabels": false,
  "allowUnreachableCode": false
}
```

**Libraries:** `["esnext", "dom", "dom.iterable"]`  
**JSX:** React JSX with Astro import source

### Linting (lint)

**Rules:** `recommended` tag + 12 additional strict rules

**Enabled rules:**
- `ban-untagged-todo` - TODOs must have issue references
- `eqeqeq` - Require === and !==
- `no-await-in-loop` - Prevent sequential async in loops
- `no-const-assign` - Prevent const reassignment
- `no-eval` - Ban eval()
- `no-explicit-any` - **No any types allowed**
- `no-sparse-arrays` - Prevent sparse arrays
- `no-throw-literal` - Require Error objects
- `no-undef` - Catch undefined variables
- `no-unreachable` - Detect unreachable code
- `no-unused-vars` - Catch unused variables
- `prefer-const` - Use const where possible

**Disabled rules:**
- `no-inferrable-types` - Redundant with TypeScript inference
- `triple-slash-reference` - Required for Astro type references

**Files checked:** `src/`  
**Excluded:** `dist/`, `node_modules/`, `.astro/`, `coverage/`

### Formatting (fmt)

**Configuration:**
- **Line width:** 100 characters
- **Quotes:** Double quotes (`"`)
- **Semicolons:** Required
- **Indentation:** 2 spaces (no tabs)
- **Prose wrap:** Preserve
- **Final newline:** Enforced

**Files formatted:** `src/`, `astro.config.mjs`  
**Excluded:** `dist/`, `node_modules/`, `.astro/`, `coverage/`, `docs/`

**Note:** `docs/` is excluded to preserve existing formatting for documentation files.

## JSR Imports

**Deno-native dependencies via JSR:**

```json
{
  "zod": "jsr:@zod/zod@^4.1.8",
  "@std/fs": "jsr:@std/fs@^1.0.19",
  "@std/path": "jsr:@std/path@^1.1.2",
  "@std/assert": "jsr:@std/assert@^1.0.14"
}
```

**Usage:**
- `zod` - Content schema validation (src/content/config.ts)
- `@std/fs` - File system operations
- `@std/path` - Path utilities
- `@std/assert` - Assertions (if tests added)

## Path Aliases

**7 configured aliases:**

```json
{
  "@components/*": "./src/components/*",
  "@layouts/*": "./src/layouts/*",
  "@utils/*": "./src/utils/*",
  "@styles/*": "./src/styles/*",
  "@config/*": "./src/config/*",
  "@/*": "./src/*",
  "@site-config": "./src/site-config.ts"
}
```

**Example usage in files:**
```typescript
import { isPathActive } from "@utils/path";
import BaseLayout from "@layouts/BaseLayout.astro";
import siteConfig from "@site-config";
```

## Available Tasks

### Development
```bash
deno task dev              # Start dev server (localhost:4321)
deno task build            # Production build
deno task preview          # Preview production build
```

### Quality Checks
```bash
deno task check            # Lint + format check
deno task check-all        # Same as check (no Astro check)
deno task fix              # Auto-fix lint and format issues
```

### Analysis
```bash
deno task knip             # Dead code detection (via npx)
```

**Note:** No `astro check` is run in `check-all` because `@astrojs/check` was removed from dependencies (it had GitHub package dependencies incompatible with Deno). TypeScript validation happens during build.

## Task Definitions (Actual)

**From deno.json:**

```json
{
  "dev": "./node_modules/.bin/astro dev",
  "build": "./node_modules/.bin/astro build",
  "preview": "deno task preview-urls && deno task preview-serve",
  "preview-serve": "deno run --allow-net --allow-read jsr:@std/http/file-server dist --port 4321",
  "preview-urls": "echo '🚀 Preview server starting...' && echo '📍 Local: http://localhost:4321' && echo '📍 Network: http://'$(ipconfig getifaddr en0 2>/dev/null || echo 'localhost')':4321' && echo ''",
  "lint": "deno lint",
  "format": "deno fmt",
  "check": "deno lint && deno fmt --check",
  "check-all": "deno lint && deno fmt --check",
  "knip": "npx knip",
  "fix": "deno lint --fix && deno fmt"
}
```

**Key points:**
- Dev/build use `./node_modules/.bin/astro` (not `deno run -A npm:astro`)
- Preview uses Deno's native HTTP file server
- Check-all does NOT run `astro check` (removed)
- Knip runs via npx for dead code detection

## Editor Integration

### Recommended: Zed Editor

**Configuration (.zed/settings.json):**
- ✅ Deno LSP enabled for TypeScript/JavaScript
- ✅ Format on save
- ✅ Auto-fix on save
- ✅ Astro language support

**Extensions required:**
- Deno language server (built-in)
- Astro language support

### VS Code (Alternative)

**Recommended extensions:**
- Deno extension (denoland.vscode-deno)
- Astro extension (astro-build.astro-vscode)

**Settings:**
```json
{
  "deno.enable": true,
  "deno.lint": true,
  "deno.unstable": false,
  "[typescript]": {
    "editor.defaultFormatter": "denoland.vscode-deno"
  }
}
```

## Pre-commit Hooks

**Location:** `.git/hooks/pre-commit`

**Runs automatically before each commit:**
1. `deno fmt` - Auto-format all code
2. `deno lint` - Catch linting errors
3. Blocks commit if lint fails

**To bypass (not recommended):**
```bash
git commit --no-verify
```

## Validation Results

### Current Status (November 16, 2025)

```
✅ Lint:       All files clean, 0 errors
✅ Format:     All files formatted correctly
✅ Build:      Static site builds successfully
✅ Knip:       No dead code detected
```

**Files validated:**
- 6 components (.astro)
- 1 layout (.astro)
- 4 pages (.astro, .js)
- 1 utility (.ts)
- 2 config files (.ts)
- 1 build config (.mjs)

## Project Structure

**TypeScript files:** 6  
**Astro files:** 16  
**MDX/Markdown:** 2  
**Total source LOC:** ~800

**Build targets:**
- Static site generation (SSG)
- No SSR (server-side rendering)
- No API routes

## Troubleshooting

### "Cannot find module" errors in editor

**Solution:** Ensure path aliases are configured in both `deno.json` and `tsconfig.json`. Restart LSP.

### Format changes not persisting

**Solution:** Check that files are in `fmt.include` paths and not in `fmt.exclude`. Run `deno fmt` manually to verify.

### Lint errors in .astro files

**Solution:** Astro files support TypeScript. Check that `triple-slash-reference` is excluded in `deno.json` lint config.

### Build fails but lint passes

**Solution:** This is expected. `deno lint` doesn't catch all TypeScript errors. Run `deno task build` to see type errors from Astro's build process.

## Best Practices

1. **Always run `deno task fix`** before committing (or let pre-commit hook handle it)
2. **Use path aliases** (@components, @utils) instead of relative imports
3. **Keep strictness enabled** - catches bugs early
4. **Trust the formatter** - don't fight the 100-char line width or double quotes
5. **Run `deno task check-all`** before pushing to ensure CI will pass
6. **Use `deno task knip`** periodically to detect unused code

## Configuration Files Reference

**Primary:**
- `/Users/DZUMAS02/Developer/blog/deno.json` - This configuration
- `/Users/DZUMAS02/Developer/blog/package.json` - npm dependencies
- `/Users/DZUMAS02/Developer/blog/tsconfig.json` - TypeScript settings

**Build:**
- `/Users/DZUMAS02/Developer/blog/astro.config.mjs` - Astro config
- `/Users/DZUMAS02/Developer/blog/knip.config.ts` - Dead code detection

## References

- [Deno Configuration](https://docs.deno.com/runtime/reference/deno_json/)
- [Deno Lint Rules](https://docs.deno.com/lint/rules/)
- [Deno Formatter](https://docs.deno.com/tools/formatter/)
- [Astro with Deno](https://docs.astro.build/en/guides/deploy/deno/)

---

**Last Updated**: November 16, 2025  
**Configuration Version**: deno.json (current)
