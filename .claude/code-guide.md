# Kumak's Blog Code Style Guide

> A pragmatic style guide for building with Astro, TypeScript, and Deno

---

## General Principles

### The Non-Negotiables

1. **Web Standards First** - Use native APIs before reaching for libraries
2. **Progressive Enhancement** - Everything works without JavaScript
3. **Semantic HTML** - Use proper elements, not `<div>` with delusions
4. **TypeScript Strict Mode** - `any` types are banned (punishable by code review shame)
5. **Accessibility** - WCAG AA compliance is not optional
6. **Performance** - Ship fast, load faster

### Code Philosophy

- **Explicit over implicit** - Code should read like documentation
- **Composition over inheritance** - Build with small, focused pieces
- **Convention over configuration** - Consistent patterns reduce cognitive load
- **Future-self friendly** - Write code your future self won't hate

---

## TypeScript Conventions

### Type Definitions

```typescript
// ✅ GOOD: Explicit interface definitions
export interface BlogPost {
  readonly title: string
  readonly slug: string
  readonly pubDate: Date
  readonly excerpt: string
  readonly tags?: readonly string[]
  readonly isDraft: boolean
}

// ✅ GOOD: Union types for controlled values
export type ThemeMode = 'light' | 'dark' | 'auto'

// ❌ BAD: Any types (career-limiting move)
const blogData: any = await fetchBlogData()

// ❌ BAD: Vague or unclear interfaces
interface Data {
  stuff: string
  things: number
}
```

### Function Signatures

```typescript
// ✅ GOOD: Explicit return types and parameter types
export function formatDate(
  date: Date,
  locale: string = 'en-US',
): string {
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// ✅ GOOD: Async functions with proper error handling
export async function fetchBlogPosts(): Promise<BlogPost[]> {
  try {
    const posts = await getCollection('blog')
    return posts.filter((post) => !post.data.isDraft)
  } catch (error) {
    throw new Error(`Failed to fetch blog posts: ${error.message}`)
  }
}

// ❌ BAD: Implicit return types
export function doSomething(data) {
  return processData(data)
}
```

### Import/Export Organization

```typescript
// ✅ GOOD: Organized imports with clear sections
// External dependencies
import { defineCollection, z } from 'astro:content'
import { getCollection } from 'astro:content'

// Internal utilities (use path aliases)
import { formatDate } from '@utils/date'
import { PostsManager } from '@utils/postSorter'

// Relative imports
import './Component.css'

// Type-only imports (last)
import type { CollectionEntry } from 'astro:content'
import type { BlogPost } from '@utils/postSorter'

// ❌ BAD: Mixed import organization
import { something } from './relative'
import type { Type } from 'astro:content'
import { external } from 'external-lib'
```

### Naming Conventions

```typescript
// ✅ GOOD: Descriptive, intention-revealing names
const publishedBlogPosts = posts.filter((post) => !post.isDraft)
const formattedPublishDate = formatDate(post.pubDate)

// Component props interface
export interface BlogCardProps {
  readonly title: string
  readonly excerpt: string
  readonly publishDate: Date
  readonly readingTime?: number
}

// ❌ BAD: Abbreviated or unclear names
const psts = posts.filter((p) => !p.d)
const dt = formatDate(post.pub)

interface Props {
  t: string
  e: string
  d: Date
}
```

---

## Astro Component Standards

### Component Structure

```astro
---
// 1. Imports (external first, then internal, then types)
import { getCollection } from 'astro:content';
import { formatDate } from '@utils/date';
import type { CollectionEntry } from 'astro:content';

// 2. Props interface (always export for reusability)
export interface Props {
  readonly title: string;
  readonly description?: string;
  readonly showPublishDate?: boolean;
}

// 3. Props destructuring with defaults
const { 
  title, 
  description,
  showPublishDate = true 
} = Astro.props;

// 4. Data fetching and processing
const blogPosts = await getCollection('blog');
const publishedPosts = blogPosts.filter(post => !post.data.isDraft);

// 5. Computed values
const pageTitle = description ? `${title} | ${description}` : title;
---

<!-- 6. HTML template (semantic structure) -->
<article class="blog-post">
  <header class="post-header">
    <h1 class="post-title">{title}</h1>
    {showPublishDate && (
      <time datetime={post.data.pubDate.toISOString()} class="post-date">
        {formatDate(post.data.pubDate)}
      </time>
    )}
  </header>
  
  <div class="post-content">
    <slot />
  </div>
</article>

<!-- 7. Component-scoped styles -->
<style>
  .blog-post {
    /* Use global design tokens */
    padding: var(--s1);
    max-width: var(--container-width);
    margin-inline: auto;
  }
  
  .post-header {
    margin-bottom: var(--s0);
    padding-bottom: var(--s-1);
    border-bottom: var(--border-thin) solid var(--color-border);
  }
  
  .post-title {
    font-size: var(--s2);
    line-height: var(--ratio);
    color: var(--color-text);
    margin: 0;
  }
  
  .post-date {
    font-size: var(--s-1);
    color: var(--color-muted);
    font-style: italic;
  }
  
  .post-content {
    line-height: var(--leading-normal);
  }
</style>
```

### Component Naming

```bash
# ✅ GOOD: PascalCase for components
BlogCard.astro
NavigationMenu.astro
ThemeToggle.astro
BlogPostLayout.astro

# ❌ BAD: Inconsistent naming
blogcard.astro
navigation-menu.astro
themeToggle.astro
blog_post_layout.astro
```

### Props Validation

```astro
---
// ✅ GOOD: Runtime validation with helpful errors
export interface Props {
  readonly title: string;
  readonly slug: string;
  readonly tags?: readonly string[];
}

const { title, slug, tags = [] } = Astro.props;

// Validate required props
if (!title || !slug) {
  throw new Error(`BlogCard requires title and slug props. Received: title="${title}", slug="${slug}"`);
}

// Validate prop types in development
if (import.meta.env.DEV) {
  if (typeof title !== 'string') {
    throw new Error(`BlogCard title must be a string, received ${typeof title}`);
  }
  if (tags && !Array.isArray(tags)) {
    throw new Error(`BlogCard tags must be an array, received ${typeof tags}`);
  }
}
---
```

---

## CSS Architecture

### Design Token Usage (From variables.css)

```css
/* ✅ GOOD: Using design tokens from variables.css */
.component {
  /* Modular scale spacing */
  padding: var(--s1);
  margin-bottom: var(--s0);
  gap: var(--s-1);

  /* Semantic color palette */
  background: var(--color-surface);
  color: var(--color-text);
  border: var(--border-thin) solid var(--color-border);

  /* Container-aware sizing */
  font-size: var(--s0);
  border-radius: var(--radius);
  max-width: var(--container-width);
}

/* ❌ BAD: Magic numbers and hardcoded values */
.component {
  padding: 16px;
  margin-bottom: 12px;
  background: #ffffff;
  color: #111111;
  font-size: 14px;
  border-radius: 4px;
  max-width: 800px;
}
```

### Data Attributes Pattern (From Navigation.astro)

```astro
<!-- ✅ GOOD: Data attributes for component identification -->
<nav data-component="navigation" aria-label="Main navigation">
  <ul data-navigation-list role="menubar">
    {siteConfig.navItems.map(({ href, title }) => (
      <li data-navigation-item role="none">
        <a data-navigation-link
          href={href}
          role="menuitem"
          aria-current={isPathActive(currentPath, href) ? "page" : undefined}
        >
          {title}
        </a>
      </li>
    ))}
  </ul>
</nav>

<!-- When to use data attributes: -->
<!-- - Component identification and scoping -->
<!-- - State indication (data-state="loading") -->
<!-- - JavaScript hooks that won't conflict with CSS -->

<!-- ✅ GOOD: Classes for utility styles -->
<div class="visually-hidden">Screen reader only content</div>
<button class="button button--primary">Submit</button>
```

### Responsive Design with Container Queries

```css
/* ✅ GOOD: Container queries where appropriate */
.card-grid {
  container-type: inline-size;
  display: grid;
  gap: var(--s0);
}

@container (min-width: 30em) {
  .card-grid {
    grid-template-columns: repeat(auto-fit, minmax(20ch, 1fr));
  }
}

/* ✅ GOOD: Fluid typography with design tokens */
.heading {
  font-size: clamp(var(--s1), 4vw, var(--s3));
  line-height: var(--ratio);
}

/* ❌ BAD: Arbitrary breakpoints and fixed sizes */
.heading {
  font-size: 24px;
}

@media (min-width: 768px) {
  .heading {
    font-size: 32px;
  }
}
```

---

## Utility Patterns

### PostsManager Usage

```typescript
// ✅ GOOD: Use PostsManager for content queries
import { PostQueries, PostsManager } from '@utils/postSorter'

// Simple filtering - use static methods
const featuredPosts = PostsManager.getFeatured(allPosts, 3)
const latestPosts = PostsManager.getLatest(allPosts, 5)

// Complex queries - use fluent API when chaining adds value
const posts = new PostsManager(allPosts)
  .filter(PostQueries.FILTER.FEATURED)
  .filterByTags(['typescript', 'astro'])
  .sort(PostQueries.SORT.NEWEST_FIRST)
  .limit(PostQueries.LIMIT.FIVE)
  .get()

// ❌ BAD: Manual filtering when PostsManager exists
const featuredPosts = allPosts
  .filter((post) => post.data.featured === true)
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
  .slice(0, 3)
```

### Error Handling Patterns (From readingTime.ts)

````typescript
// ✅ GOOD: Comprehensive JSDoc with examples
/**
 * Calculate reading time with different speeds for text and code
 *
 * @param content - The markdown content to analyze
 * @returns Reading time result with minutes, words, and formatted string
 *
 * @example
 * ```typescript
 * const result = calculateReadingTime('Hello world')
 * console.log(result.time) // "1 min read"
 * ```
 */
export function calculateReadingTime(content: string): ReadingTimeResult {
  const WORDS_PER_MINUTE = 200 // Average reading speed
  const CODE_WORDS_PER_MINUTE = 50 // Slower for code

  const textWords = countTextWords(content)
  const codeWords = countCodeWords(content)
  const totalWords = textWords + codeWords

  const textMinutes = textWords / WORDS_PER_MINUTE
  const codeMinutes = codeWords / CODE_WORDS_PER_MINUTE
  const totalMinutes = Math.ceil(textMinutes + codeMinutes)

  // Format the reading time string
  let timeString: string
  if (totalMinutes === 1) {
    timeString = '1 min read'
  } else if (totalMinutes < 1) {
    timeString = 'Less than 1 min'
  } else {
    timeString = `${totalMinutes} min read`
  }

  return {
    minutes: totalMinutes,
    words: totalWords,
    time: timeString,
  }
}

// ✅ GOOD: Guard clauses for early returns
function countTextWords(content: string): number {
  if (!content || typeof content !== 'string') {
    return 0
  }

  // Remove code blocks first
  const withoutCode = content.replace(/```[\s\S]*?```/g, '')
  const withoutInlineCode = withoutCode.replace(/`[^`]*`/g, '')
  const withoutHtml = withoutInlineCode.replace(/<[^>]*>/g, '')

  const words = withoutHtml.match(/\b\w+\b/g) || []
  return words.length
}
````

---

## Deno Specific Patterns

### Import Maps and Path Aliases

```typescript
// ✅ GOOD: Use configured path aliases from deno.json
import { siteConfig } from '@site-config'
import { formatDate } from '@utils/date'
import { PostsManager } from '@utils/postSorter'
import Navigation from '@components/Navigation.astro'
import Layout from '@layouts/Layout.astro'

// ✅ GOOD: JSR imports for standard library
import { assertEquals, assertThrows } from '@std/assert'
import { join } from '@std/path'
import { exists } from '@std/fs'

// ❌ BAD: Relative imports for common utilities
import { siteConfig } from '../../../site-config.ts'
import { formatDate } from '../../utils/date.ts'
```

### Deno Task Scripts

```json
// ✅ GOOD: Clear, descriptive task names from deno.json
{
  "tasks": {
    "dev": "deno run -A npm:astro dev",
    "build": "deno run -A npm:astro build",
    "check-all": "deno run -A npm:astro check && deno lint && deno fmt",
    "fix": "deno lint --fix && deno fmt"
  }
}
```

### Testing with Deno.test

````typescript
// ✅ GOOD: Descriptive test names and clear structure
import { assertEquals, assertThrows } from '@std/assert'
import { calculateReadingTime } from '@utils/readingTime'

Deno.test('calculateReadingTime: should handle empty content', () => {
  // Arrange
  const emptyContent = ''

  // Act
  const result = calculateReadingTime(emptyContent)

  // Assert
  assertEquals(result.words, 0)
  assertEquals(result.time, 'Less than 1 min')
})

Deno.test('calculateReadingTime: should count code blocks differently', () => {
  // Arrange
  const content = 'Regular text here.\n\n```typescript\nconst code = "here";\n```'

  // Act
  const result = calculateReadingTime(content)

  // Assert - Code words are counted at slower reading speed
  assertEquals(result.minutes, 1)
  assertEquals(result.time, '1 min read')
})
````

---

## Performance Guidelines

### Bundle Optimization

```astro
---
// ✅ GOOD: Import only what you need
import { formatDate } from '@utils/date'
import { calculateReadingTime } from '@utils/readingTime'
import type { BlogPost } from '@utils/postSorter'

// ✅ GOOD: Conditional imports for client-side code
const isProduction = import.meta.env.PROD
const analytics = isProduction ? await import('./analytics') : null

// ❌ BAD: Importing entire utility libraries
import * as dateUtils from '@utils/date'
import '@utils/postSorter' // Side effects without usage
---

<!-- ✅ GOOD: Lazy loading for non-critical images -->
<Image
  src={post.heroImage}
  alt={post.title}
  loading="lazy"
  format="webp"
  quality={80}
/>

<!-- ✅ GOOD: Preload critical resources -->
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
```

### Data Fetching Optimization

```typescript
// ✅ GOOD: Filter early, transform late (PostsManager pattern)
export async function getFeaturedPosts(): Promise<BlogPost[]> {
  const allPosts = await getCollection('blog')

  // Use PostsManager for consistent, optimized filtering
  return PostsManager.getFeatured(allPosts, 5)
}

// ❌ BAD: Processing all data before filtering
export async function getFeaturedPosts(): Promise<BlogPost[]> {
  const allPosts = await getCollection('blog')

  const processed = allPosts
    .map((post) => ({ ...post, readingTime: calculateReadingTime(post.body) }))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .filter((post) => !post.data.draft && post.data.featured)

  return processed.slice(0, 5)
}
```

---

## Git Workflow

### Commit Messages

```bash
# ✅ GOOD: Clear, descriptive commit messages
feat: Add reading time calculation to blog posts
fix: Correct date formatting in Safari browsers
refactor: Extract PostsManager utility for content queries
docs: Add JSDoc comments to date utility functions
test: Add unit tests for formatDate function

# ❌ BAD: Vague or unclear messages
update stuff
fix bug
changes
wip
```

### Branch Naming

```bash
# ✅ GOOD: Descriptive branch names
feature/reading-time-calculator
fix/safari-date-formatting
refactor/posts-manager-utility
docs/jsdoc-comments

# ❌ BAD: Unclear branch names
fix-bug
new-feature
updates
temp-branch
```

---

## Quality Checklist

Before committing code, ensure:

### Required Checks

- [ ] `deno task check-all` passes (Astro check + lint + format)
- [ ] `deno task test` passes
- [ ] No `any` types used
- [ ] Props interfaces exported for reusability
- [ ] Error handling implemented for async operations
- [ ] Semantic HTML structure used

### Best Practices

- [ ] Design tokens used instead of magic numbers
- [ ] Descriptive variable and function names
- [ ] JSDoc comments for complex functions
- [ ] Tests added for new utility functions
- [ ] Performance considered for data operations

### Accessibility

- [ ] Proper heading hierarchy
- [ ] Alt text for images
- [ ] Color contrast meets WCAG AA
- [ ] Keyboard navigation works
- [ ] Screen reader testing performed

---

## Tools and Configuration

### Required Extensions (VS Code/Zed)

- Astro language support
- TypeScript/Deno support
- CSS/HTML validation
- Auto-formatting on save

### Editor Settings

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  },
  "deno.enable": true,
  "deno.lint": true,
  "deno.unstable": false
}
```

This style guide is a living document. Update it as patterns evolve and new conventions emerge.
