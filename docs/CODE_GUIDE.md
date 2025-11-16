# Kumak's Blog Code Style Guide

> A pragmatic style guide for building with Astro, TypeScript, and Deno

## Core Principles

1. **Web Standards First** - Use native APIs before libraries
2. **Semantic HTML** - Use proper elements, not `<div>` soup
3. **TypeScript Strict** - No `any` types allowed
4. **Accessibility** - WCAG AA compliance required
5. **Performance** - Ship fast, load faster

## Project Structure

### Components (src/components/)

**6 Components, 316 LOC total:**
- **BlogPostCard.astro** - Blog post preview cards with metadata
- **Footer.astro** - Site footer with social links
- **FormattedDate.astro** - Date formatting utility component
- **Head.astro** - HTML head with SEO meta tags
- **Hero.astro** - Homepage hero section
- **NavBar.astro** - Main navigation with active state detection

### Layouts (src/layouts/)

**1 Layout:**
- **BaseLayout.astro** - Base page layout with grid structure

### Pages (src/pages/)

**4 Pages:**
- **index.astro** - Homepage with hero and post list
- **about.astro** - About page
- **[...slug].astro** - Dynamic blog post pages
- **rss.xml.js** - RSS feed generation

### Utilities (src/utils/)

**1 Utility:**
- **path.ts** - Active link detection for navigation

## Layout Architecture

### CSS Responsibility Model

```
global.css (248 LOC)     → Design tokens + reset + utilities ONLY
Component <style>        → All component presentation
BaseLayout <style>       → Page layout + prose styles
```

**Decision Tree:**
- CSS variable/token? → `global.css`
- Reset rule? → `global.css`
- Utility class? → `global.css`
- Component-specific? → Component `<style>` block
- Page layout/prose? → `BaseLayout <style is:global>`

### Design Token System

All measurements use harmonic scale (1.25 ratio - Major Third):

**Spacing:**
```css
--space-xs:   0.5rem   /* 8px */
--space-sm:   0.75rem  /* 12px */
--space-md:   1rem     /* 16px */
--space-lg:   1.5rem   /* 24px */
--space-xl:   2rem     /* 32px */
--space-2xl:  3rem     /* 48px */
--space-3xl:  4rem     /* 64px */
```

**Typography:**
```css
--text-xs:   0.8rem    /* 12.8px */
--text-sm:   0.9rem    /* 14.4px */
--text-base: 1rem      /* 16px */
--text-lg:   1.125rem  /* 18px */
--text-xl:   1.25rem   /* 20px */
--text-2xl:  1.563rem  /* 25px */
--text-3xl:  1.953rem  /* 31.25px */
```

**Colors:**
```css
--color-text:        /* Primary text color */
--color-text-muted:  /* Secondary text */
--color-primary:     /* Brand/accent color */
--color-bg:          /* Background */
--color-border:      /* Border colors */
```

**Vertical Rhythm:**
```css
--rhythm-quarter: 0.25lh
--rhythm-half:    0.5lh
--rhythm-single:  1lh
--rhythm-double:  2lh
```

### CSS Grid + Semantic HTML

```css
/* Sticky footer pattern (BaseLayout) */
body {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100dvh;
}

/* Main content uses named grid lines */
body > main {
  display: grid;
  grid-template-columns:
    [full-start] 1fr
    [content-start] min(100% - 2 * var(--space-lg), 65ch) [content-end]
    1fr [full-end];
}
```

### Rules

- ✅ All component styles in scoped `<style>` blocks
- ✅ Use design tokens from global.css
- ✅ Semantic HTML without wrapper divs
- ❌ NO component styles in global.css
- ❌ NO element selectors in global (h1, nav, article)
- ❌ NO inline styles

## TypeScript Conventions

```typescript
// ✅ GOOD: Explicit interfaces with readonly
export interface BlogPost {
  readonly title: string;
  readonly slug: string;
  readonly pubDate: Date;
  readonly tags?: readonly string[];
}

// ✅ GOOD: Descriptive names
const publishedPosts = await getCollection("blog", ({ data }) => !data.draft);
const sortedPosts = publishedPosts.sort((a, b) => 
  b.data.pubDate.getTime() - a.data.pubDate.getTime()
);

// ❌ BAD: Any types or unclear names
const data: any = await fetch(); // NO 'any' allowed
const psts = posts.filter((p) => !p.d); // Unclear abbreviations
```

### Strict TypeScript Rules

**Enforced via deno.json:**
- `noImplicitAny: true` - All types must be explicit
- `strictNullChecks: true` - Handle null/undefined explicitly
- `noUnusedLocals: true` - No unused variables
- `noUncheckedIndexedAccess: true` - Array access returns T | undefined
- `exactOptionalPropertyTypes: true` - No undefined for optional properties

## Astro Component Structure

### Page Components (src/pages/)

```astro
---
import { getCollection } from "astro:content";
import BaseLayout from "@layouts/BaseLayout.astro";
import BlogPostCard from "@components/BlogPostCard.astro";

const posts = (await getCollection("blog"))
  .filter(({ data }) => !data.draft)
  .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
---

<BaseLayout title="Blog">
  <section>
    {posts.map((post) => (
      <BlogPostCard post={post} />
    ))}
  </section>
</BaseLayout>

<style>
  section {
    display: grid;
    gap: var(--space-xl);
    padding: var(--space-2xl) 0;
  }
</style>
```

### Reusable Components (src/components/)

```astro
---
export interface Props {
  readonly title: string;
  readonly description?: string;
  readonly pubDate: Date;
}

const { title, description, pubDate } = Astro.props;
---

<article>
  <header>
    <h2>{title}</h2>
    <time datetime={pubDate.toISOString()}>
      {pubDate.toLocaleDateString()}
    </time>
  </header>
  {description && <p>{description}</p>}
</article>

<style>
  article {
    padding: var(--space-lg);
    border: 1px solid var(--color-border);
    border-radius: var(--space-xs);
  }

  h2 {
    font-size: var(--text-xl);
    margin: 0;
  }
</style>
```

## Content Management

### Content Collections (src/content/)

**Schema (config.ts with Zod):**
```typescript
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    draft: z.boolean().default(false),
    category: z.enum(["tutorial", "opinion", "project", "philosophy"]),
    tags: z.array(z.string()).default([]),
    author: z.string().default("Szymon Dzumak"),
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

**Querying posts:**
```typescript
import { getCollection } from "astro:content";

// Get all published posts
const posts = await getCollection("blog", ({ data }) => !data.draft);

// Sort by date (newest first)
const sortedPosts = posts.sort(
  (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()
);

// Filter by tag
const taggedPosts = posts.filter(({ data }) => 
  data.tags.includes("typescript")
);

// Get featured posts
const featuredPosts = posts
  .filter(({ data }) => data.featured)
  .slice(0, 3);
```

## Path Aliases

**7 configured aliases (deno.json):**

```typescript
import BaseLayout from "@layouts/BaseLayout.astro";
import NavBar from "@components/NavBar.astro";
import { isPathActive } from "@utils/path";
import siteConfig from "@site-config";
```

## CSS Architecture

### Design Token Usage

```css
/* ✅ GOOD: Use design tokens */
.card {
  padding: var(--space-lg);
  gap: var(--space-md);
  color: var(--color-text);
  font-size: var(--text-base);
}

/* ❌ BAD: Magic numbers */
.card {
  padding: 24px;
  gap: 16px;
  color: #111111;
  font-size: 16px;
}
```

### Semantic Selectors

```css
/* ✅ GOOD: Semantic structure */
body > header              /* Site header */
header nav                 /* Main navigation */  
nav a[aria-current="page"] /* Active state */
body > footer              /* Site footer */

/* ❌ BAD: BEM methodology */
.header__content {}
.nav__item--active {}
```

### Cascade & Inheritance

```css
/* ✅ GOOD: Leverage inheritance */
body > footer {
  color: var(--color-text-muted); /* Inherited by children */
}

body > footer p {
  margin: 0; /* Only override what's needed */
}
```

## Accessibility Requirements

### Semantic HTML

```html
<!-- ✅ GOOD: Semantic elements -->
<nav aria-label="Main navigation">
  <a href="/" aria-current="page">Home</a>
</nav>

<article>
  <h1>Blog Post Title</h1>
  <time datetime="2025-11-16">November 16, 2025</time>
</article>

<!-- ❌ BAD: Div soup -->
<div class="nav">
  <div class="link active">Home</div>
</div>
```

### ARIA Labels

```astro
<nav aria-label="Social media links">
  <a href="https://github.com/..." aria-label="GitHub Profile">
    <svg aria-hidden="true">...</svg>
  </a>
</nav>
```

## Performance Best Practices

### Image Optimization

```astro
---
import { Image } from "astro:assets";
---

<Image 
  src={heroImage} 
  alt={title}
  width={1200}
  height={630}
  loading="lazy"
  decoding="async"
/>
```

### Prefetching

Configured in astro.config.mjs:
```javascript
prefetch: {
  prefetchAll: true,
  defaultStrategy: "viewport"
}
```

## Quality Checklist

### Required Checks

- [ ] `deno task check-all` passes (lint + format)
- [ ] No `any` types used
- [ ] Semantic HTML structure
- [ ] Component styles in scoped `<style>` blocks
- [ ] Design tokens used for spacing/colors/typography
- [ ] ARIA labels for interactive elements

### Best Practices

- [ ] Path aliases used (@components, @utils)
- [ ] Descriptive variable names (no abbreviations)
- [ ] TypeScript interfaces with readonly
- [ ] WCAG AA compliance
- [ ] Viewport-based prefetching for internal links

## Anti-Patterns

### Component Styles

```astro
<!-- ❌ BAD: Layout styles in components -->
<header class="site-header">
  <NavBar />
</header>
<style>
  .site-header { 
    position: sticky;
    display: grid;
  }
</style>

<!-- ✅ GOOD: Clean semantic markup, styles in BaseLayout -->
<header>
  <NavBar />
</header>
```

### TypeScript

```typescript
// ❌ BAD: Any types
const config: any = await import("./config");

// ✅ GOOD: Explicit types
interface Config {
  readonly site: string;
  readonly title: string;
}
const config: Config = await import("./config");
```

### CSS

```css
/* ❌ BAD: Element selectors in global.css */
h1 { font-size: 2rem; }
nav { display: flex; }

/* ✅ GOOD: Only tokens and utilities in global.css */
:root {
  --text-2xl: 1.953rem;
}
.flow > * + * {
  margin-top: var(--rhythm-single);
}
```

---

**Last Updated**: November 16, 2025  
This is a living document. Update as patterns evolve.
