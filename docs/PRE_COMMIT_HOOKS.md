# Pre-commit Hooks & CI/CD Pipeline

Optimized quality gate system balancing speed and code quality.

## Architecture

**Two-Tier Quality Gates:**
1. **Pre-commit** (local, fast) - Catches obvious issues immediately
2. **CI Pipeline** (comprehensive) - Full validation before merge/deploy

## Pre-commit Hooks

**Performance Target:** < 2 seconds
**Actual Performance:** ~230ms

### What Runs

```bash
# Triggered automatically on git commit
deno fmt --check  # ~70ms - Format validation
deno lint         # ~23ms - Linting
```

### What Doesn't Run

❌ Build (~1.5s) - Deferred to CI
❌ Type checking - Handled by Astro build in CI
❌ Tests - Deferred to CI

### Setup

Hooks are automatically installed via Husky:

```bash
npm install  # Runs 'husky' prepare script
```

### Bypass (Emergency Only)

```bash
git commit --no-verify -m "emergency fix"
```

**Note:** CI will still catch issues.

## CI/CD Pipeline

### Quality Job (Parallel)

Runs lint and format checks in parallel using matrix strategy:

```yaml
strategy:
  matrix:
    check: [lint, format]
```

**Optimizations:**
- ✅ Parallel execution via matrix
- ✅ Deno dependency caching
- ✅ Fast failure (checks before build)

### Build Job (Sequential)

Runs only after quality checks pass:

```yaml
needs: quality  # Depends on lint + format
```

**Steps:**
1. Install npm dependencies (with cache)
2. Run full Astro build (~1.5s)
3. Deploy to Deno Deploy (main branch only)

**Optimizations:**
- ✅ npm dependency caching
- ✅ Deno dependency caching
- ✅ Conditional deploy (main only)

## Performance Comparison

| Check | Local (pre-commit) | CI |
|-------|-------------------|-----|
| Format | ✅ 70ms | ✅ Parallel |
| Lint | ✅ 23ms | ✅ Parallel |
| Build | ❌ Skipped | ✅ 1.5s |
| Type Check | ❌ Skipped | ✅ Via build |

**Total Pre-commit:** ~230ms
**Total CI (parallel):** ~1.5s (quality checks overlap)

## Rationale

### Why Not Build Pre-commit?

1. **Small codebase** (14 files) - lint catches most issues
2. **Build is slow** (1.5s) - 7x slower than all other checks
3. **Type errors caught in CI** - Astro build validates types
4. **Fast feedback loop** - Developers commit more frequently

### Why Not Type Check Pre-commit?

- Astro files require full Astro context
- `deno check` can't process `.astro` files
- Type errors caught during build step

### Why No lint-staged?

**Deno is already fast enough:**
- Checking all 19 files: 70ms
- Checking 2 staged files: 29ms
- **Difference: 41ms** (not worth the complexity)

With only 14 source files, the overhead of determining staged files exceeds the time saved.

## Research Summary

### Deno-Specific Solutions Evaluated

**deno_hooks** - Husky alternative for Deno (zero dependency)
**Lefthook** - Language-agnostic Go binary (fast, no package.json)
**pre-commit-deno** - Python pre-commit framework hooks

**Chosen:** Husky (battle-tested, npm already in project)

### Best Practices Applied

✅ **Speed optimization** - Checks complete in < 250ms
✅ **Incremental checks** - Not needed (Deno is fast enough)
✅ **Caching strategy** - CI caches Deno + npm dependencies
✅ **Parallel execution** - CI runs lint/format simultaneously
✅ **Fast failure** - Quality checks before expensive build
✅ **Clear feedback** - Helpful error messages with fix commands

## Measured Performance Baselines

```
deno fmt --check:        70ms (19 files)
deno lint:               23ms (5 files)
deno task build:       1.5s (full Astro build)
Combined pre-commit:   229ms (actual)
```

**Staged-only comparison:**
```
2 files fmt:  29ms
2 files lint: 26ms
Savings:      41ms (not worth complexity)
```

## Developer Workflow

**Normal Commit:**
```bash
git add .
git commit -m "feat: add new component"
# → Pre-commit runs (~230ms)
# → Commit succeeds
# → Push triggers CI
```

**Failed Pre-commit:**
```bash
git commit -m "fix: broken code"
# → Pre-commit fails
# → Helpful message: "Run 'deno task fix' to auto-fix"
deno task fix
git add .
git commit -m "fix: broken code"
# → Success
```

## Future Optimizations

**If codebase grows significantly:**
- Consider lint-staged when > 100 files
- Add pre-push hooks for heavier checks
- Split CI into separate test/deploy workflows

**Current size:** 14 source files - optimization not needed yet.
