# Component Removal & Refactoring Plan

## Overview

This plan outlines the systematic removal of unnecessary components to achieve a minimal, maintainable blog architecture.

## Goal

Reduce from 21 components to 10 components (52% reduction) by removing decorative, nice-to-have, and over-engineered features.

## Phase 1: Remove Decorative Components

### Files to Delete

1. `src/components/AncientSymbols.astro`
2. `src/components/AnimatedGrid.astro`
3. `src/components/HeroTitle.astro`
4. `src/components/Stack.astro`
5. `src/components/Logo.astro`

### Required Refactoring

**Hero.astro modifications:**

- Remove imports: `AncientSymbols`, `AnimatedGrid`, `Stack`, `HeroTitle`
- Replace `<HeroTitle>{siteConfig.name}</HeroTitle>` with `<h1>{siteConfig.name}</h1>`
- Replace `<Stack>` wrapper with plain `<div>` or remove entirely
- Remove AnimatedGrid conditional rendering block
- Remove AncientSymbols component call

## Phase 2: Remove Blog Enhancement Components

### Files to Delete

1. `src/components/TableOfContents.astro`
2. `src/components/RelatedPosts.astro`
3. `src/components/CategoryBadge.astro`
4. `src/components/Tags.astro`
5. `src/components/PostContent.astro`

### Required Refactoring

**BlogPost.astro layout modifications:**

- Remove imports: `TableOfContents`, `Tags`, `CategoryBadge`, `RelatedPosts`
- Delete the TOC section entirely
- Replace CategoryBadge with plain text or remove
- Remove Tags display section
- Remove RelatedPosts section at bottom

**PostCard.astro modifications:**

- Remove PostContent import
- Replace `<PostContent post={post} />` with direct content rendering
- Render title, date, and description directly in PostCard

## Phase 3: Simplify Social Component

### Files to Delete

1. `src/components/Social.astro`

### Required Refactoring

**Header.astro modifications:**

- Remove Social import
- Either remove social links entirely OR inline them directly (recommendation: remove)

## Phase 4: Update All Import Statements

### Files Requiring Import Cleanup

1. `src/pages/index.astro` - Remove deleted component imports
2. `src/layouts/BlogPost.astro` - Remove deleted component imports
3. `src/components/Header.astro` - Remove Social import
4. `src/components/Hero.astro` - Remove multiple imports
5. `src/components/PostCard.astro` - Remove PostContent import
6. `src/components/Articles.astro` - Verify PostCard changes don't break it

## Phase 5: Testing & Verification

### Commands to Execute

```bash
# Check for TypeScript errors after each phase
deno task check-all

# Test the development server
deno task dev

# Verify no broken imports remain
grep -r "AncientSymbols\|AnimatedGrid\|HeroTitle\|Stack\|Logo\|TableOfContents\|RelatedPosts\|CategoryBadge\|Tags\|PostContent\|Social" src/

# Run full quality checks
deno task lint
deno task format
```

## Final Component List (10 Components)

### Essential Structure

- `Head.astro` - HTML meta tags and document head
- `Header.astro` - Main site header
- `Footer.astro` - Site footer
- `Navigation.astro` - Core navigation menu

### Core Content Components

- `Hero.astro` - Homepage hero section (simplified)
- `Articles.astro` - Blog post listing on homepage
- `Projects.astro` - Projects section listing
- `ProjectCard.astro` - Individual project display
- `PostCard.astro` - Blog post card display
- `FormattedDate.astro` - Date formatting utility

## Execution Guidelines

### Order of Operations

1. **Delete in phases** - Complete each phase before moving to next
2. **Fix imports immediately** after each deletion
3. **Test after each phase** to catch errors early
4. **Use simple HTML replacements** (div, h1, p, span)
5. **Remove ALL references** to deleted components

### Error Prevention Checklist

- [ ] Before deleting: `grep -r "ComponentName" src/` to find all usages
- [ ] After deletion: Fix all files that imported the component
- [ ] No dangling imports or component calls remain
- [ ] TypeScript compilation passes: `deno task check-all`
- [ ] Dev server runs without errors: `deno task dev`

### Rollback Strategy

If issues arise:

1. Check git status to see changed files
2. Revert problematic changes: `git checkout -- <file>`
3. Re-run quality checks
4. Proceed more carefully with smaller changes

## Expected Benefits

- **52% component reduction** (21 → 10 components)
- **Simpler codebase** - easier to understand and maintain
- **Faster builds** - less code to process
- **Better performance** - fewer components to render
- **Focused functionality** - only essential features remain

## Success Criteria

- [ ] All 11 identified components deleted
- [ ] All imports updated and cleaned
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Dev server runs successfully
- [ ] Homepage loads with simplified Hero
- [ ] Blog posts display without enhancement components
- [ ] Projects section still functional
