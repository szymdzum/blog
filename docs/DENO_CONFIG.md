# Deno Configuration Documentation

**Repository:** Kumak's Blog (Astro + Deno)  
**Deno Version:** 2.5.3  
**Configuration Date:** November 16, 2025

## Overview

This project uses Deno 2 as the primary runtime with npm for dependency management due to Astro tooling requirements.

## Why npm instead of deno install?

Astro's `@astrojs/check` dependency includes `volar-service-emmet` which references a GitHub package (`github:ramya-rao-a/css-parser#vscode`). Deno blocks non-npm dependencies for security reasons, so we use:

```bash
npm install  # ✓ Correct
deno install # ✗ Fails on volar-service-emmet
```

This is **build-time only** - the production site is fully static with zero runtime dependencies.

## Configuration Highlights

### TypeScript (`compilerOptions`)

**Strictness level:** Maximum

- ✅ `strict: true` - All strict checks enabled
- ✅ `noImplicitAny` - No implicit any types
- ✅ `strictNullChecks` - Null safety enforced
- ✅ `noUnusedLocals` - Catch unused variables
- ✅ `noUnusedParameters` - Catch unused function params
- ✅ `noUncheckedIndexedAccess` - Array/object access safety
- ✅ `exactOptionalPropertyTypes` - Strict optional properties
- ✅ `noImplicitReturns` - All code paths must return

**Libraries:** `["esnext", "dom", "dom.iterable"]`  
**JSX:** React JSX with Astro import source

### Linting (`lint`)

**Rules:** `recommended` tag + 12 additional rules

Enabled strict rules:
- `ban-untagged-todo` - TODOs must have issue references
- `eqeqeq` - Require === and !==
- `no-await-in-loop` - Prevent sequential async in loops
- `no-eval` - Ban eval()
- `no-explicit-any` - No any types
- `prefer-const` - Use const where possible

Disabled:
- `triple-slash-reference` - Required for Astro type references
- `no-inferrable-types` - Redundant with TypeScript inference

**Files checked:** `src/`, `tests/`

### Formatting (`fmt`)

- **Line width:** 100 characters
- **Quotes:** Double quotes (`"`)
- **Semicolons:** Required
- **Indentation:** 2 spaces (no tabs)
- **Final newline:** Enforced

**Files formatted:** `src/`, `tests/`, `astro.config.mjs`  
**Excluded:** `docs/` (to preserve existing formatting)

## Editor Integration

### Zed Editor (.zed/settings.json)

- ✅ Deno LSP enabled for TypeScript/JavaScript
- ✅ Format on save
- ✅ Auto-fix on save
- ✅ Astro language support

**Extensions required:**
- Deno language server (built-in)
- Astro language support

## Pre-commit Hooks

Location: `.git/hooks/pre-commit`

Runs automatically before each commit:
1. `deno fmt` - Auto-format all code
2. `deno lint` - Catch linting errors
3. Blocks commit if lint fails

## Available Tasks

```bash
# Development
deno task dev              # Start dev server
deno task build            # Production build
deno task preview          # Preview production build

# Quality Checks
deno task check            # Lint + format check
deno task check-all        # Full check (types + lint + format)
deno task fix              # Auto-fix lint and format issues

# Testing
deno task test             # Run tests
deno task test:watch       # Watch mode
deno task test:coverage    # With coverage

# Analysis
deno task knip             # Dead code detection (via npx)
```

## Validation Results

### Current Status (as of 2025-11-16)

```
✅ Lint:       8 files checked, 0 errors
✅ Format:     29 files checked, all formatted
✅ Type Check: 22 files, 0 errors, 0 warnings
✅ Build:      8 pages built successfully
✅ Knip:       No dead code (1 config hint only)
```

## Project Structure

**File breakdown:**
- 6 TypeScript files (utilities, config)
- 16 Astro files (components, layouts, pages)
- 2 MDX blog posts
- Static site generation (SSG) only, no SSR

**Target environments:**
- Browser (client-side)
- Deno (build-time)

## Troubleshooting

### "Error in volar-service-emmet" during deno install

**Expected behavior.** Use `npm install` instead. This is an Astro tooling limitation, not a bug.

### Lint errors in env.d.ts

Triple-slash references are allowed via `triple-slash-reference` exclusion in deno.json.

### Format changes on save not working

Ensure Zed has Deno enabled: check `.zed/settings.json` exists and Deno extension is installed.

## Best Practices

1. **Always run `deno task fix`** before committing (or let pre-commit hook do it)
2. **Use `npx` for npm-only tools** like Knip (already configured in tasks)
3. **Keep strictness enabled** - catches bugs early
4. **Trust the formatter** - don't fight the 100-char line width
5. **Use `deno task check-all`** for comprehensive validation

## References

- [Deno TypeScript Configuration](https://docs.deno.com/runtime/reference/ts_config_migration/)
- [Deno Lint Rules](https://docs.deno.com/lint/)
- [Astro with Deno](https://docs.astro.build/en/guides/deploy/deno/)
