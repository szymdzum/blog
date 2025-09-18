# Single Post Entry System - Complete Guide

> **The Foundation**: This document covers the single most important piece of our blog - the individual post entry system. Understanding this system is crucial for creating, managing, and optimizing blog content.

## Overview

The single post entry system is built on **Astro 5.13.7** with **Deno 2.x** runtime, leveraging content collections for type-safe, performant blog post management. The system generates static pages with zero JavaScript by default while supporting interactive MDX components when needed.

### Architecture at a Glance

- **Static Generation**: Pre-rendered HTML for maximum performance
- **Type Safety**: Zod schema validation with TypeScript
- **Content Collections**: Organized, queryable content management
- **MDX Support**: Markdown with React component integration
- **Performance First**: <1s First Contentful Paint, 95+ Lighthouse scores

## Content Schema

Our blog posts use a comprehensive Zod schema defined in `src/content/config.ts` that ensures data integrity and provides TypeScript support.

### Required Fields

#### `title: string`

The post title displayed in the header and used for SEO.

- **Best Practice**: Keep under 60 characters for SEO
- **Example**: `"Building Fast APIs with Deno Fresh"`

#### `description: string`

Meta description for SEO and social sharing.

- **Best Practice**: 120-160 characters, compelling summary
- **Example**: `"Learn how to build lightning-fast APIs using Deno Fresh. Complete guide with examples, performance tips, and deployment strategies."`

#### `pubDate: Date`

Publication date, automatically coerced to Date object.

- **Format**: `'Jan 18 2025'` or `'2025-01-18'`
- **Usage**: Displayed in post metadata, used for sorting

#### `category: 'tutorial' | 'opinion' | 'project' | 'philosophy'`

Post categorization for organization and filtering.

- **tutorial**: Step-by-step guides and how-tos
- **opinion**: Personal thoughts and industry commentary
- **project**: Project showcases and case studies
- **philosophy**: High-level thinking and principles

### Optional Fields

#### Display & SEO

- `heroImage?: string` - Hero image path (relative to public/)
- `featured: boolean` (default: false) - Featured post flag
- `draft: boolean` (default: false) - Draft status (dev-only visibility)
- `tags: string[]` (default: []) - Post tags for categorization
- `keywords?: string[]` - SEO keywords for search optimization
- `author: string` (default: 'Szymon Dzumak') - Author name

#### Content Features

- `showToc: boolean` (default: false) - Table of contents display
- `minutesToRead?: number` - Reading time (auto-calculated)
- `updatedDate?: Date` - Last update date
- `relatedPosts?: string[]` - Manual related post slugs
- `externalLinks?: Array<{title: string, url: string}>` - External resource links

### Example Complete Frontmatter

```yaml
---
title: 'Mastering Astro Content Collections'
description: 'Complete guide to building type-safe, performant blogs with Astro content collections. Includes schemas, validation, and best practices.'
pubDate: 'Jan 18 2025'
category: 'tutorial'
heroImage: '/blog/astro-collections-hero.jpg'
featured: true
draft: false
tags: ['astro', 'typescript', 'web-development']
keywords: ['astro content collections', 'static site generator', 'typescript blog']
author: 'Szymon Dzumak'
showToc: true
updatedDate: 'Jan 20 2025'
relatedPosts: ['astro-performance-guide', 'deno-deploy-setup']
externalLinks:
  - title: 'Astro Content Collections Docs'
    url: 'https://docs.astro.build/en/guides/content-collections/'
  - title: 'Zod Validation Library'
    url: 'https://zod.dev/'
---
```

## File Structure & Organization

### Directory Layout

```
src/content/blog/
├── post-slug-one.md          # Standard Markdown
├── interactive-post.mdx      # MDX with components
├── draft-post.mdx           # Draft (draft: true)
└── images/                  # Post-specific images
    ├── hero-image.jpg
    └── diagram.png
```

### Naming Conventions

- **Kebab-case filenames**: `my-awesome-post.mdx`
- **URL generation**: Filename becomes URL slug `/blog/my-awesome-post`
- **No date prefixes**: Use `pubDate` frontmatter instead
- **Descriptive names**: Reflect post content, not technical details

### MDX vs Markdown Decision Tree

```
Need interactive components? → Use .mdx
  ├── Charts, graphs, demos → .mdx
  ├── Custom React components → .mdx
  └── Import statements needed → .mdx

Pure content? → Use .md
  ├── Text, images, code blocks → .md
  ├── Simple formatting → .md
  └── Maximum performance → .md
```

## Rendering Pipeline

The journey from MDX file to rendered page involves several optimized steps:

### 1. Content Collection Processing

```typescript
// src/content/config.ts
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    category: z.enum(['tutorial', 'opinion', 'project', 'philosophy']),
    // ... additional schema fields
  }),
})
```

### 2. Static Path Generation

```typescript
// src/pages/blog/[...slug].astro
export async function getStaticPaths() {
  const posts = await getCollection('blog')
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: post,
  }))
}
```

### 3. MDX Compilation & Component Resolution

```typescript
const { Content, headings } = await render(post)
```

- Transforms MDX to executable JavaScript
- Resolves component imports
- Extracts heading structure for TOC

### 4. Layout Integration

```astro
<BlogPost {...post.data} headings={headings} id={post.id} slug={post.slug} body={post.body}>
  <Content />
</BlogPost>
```

### 5. Final HTML Generation

- Static HTML with minimal JavaScript
- Optimized CSS delivery
- Prefetched resources for navigation

## Components Architecture

### BlogPost Layout (`src/layouts/BlogPost.astro`)

The primary layout component that structures individual blog posts:

```astro
---
// Type-safe props from collection schema
type Props = CollectionEntry<"blog">["data"] & {
  id?: string;
  slug?: string;
  body?: string;
};

const { title, description, pubDate, category, tags, body = "" } = Astro.props;
const readingTime = formatReadingTime(body);
---

<BaseLayout title={title} description={description}>
  <article class="article">
    <!-- Hero image (conditional) -->
    <!-- Article header with metadata -->
    <!-- Content body with prose styling -->
  </article>
</BaseLayout>
```

**Key Features:**

- Hero image display (conditional)
- Article metadata (category, date, reading time)
- Draft badge (dev environment only)
- Tag display with styling
- Update indicator for revised posts
- Semantic HTML structure

### FormattedDate Component (`src/components/FormattedDate.astro`)

Consistent date formatting across the site:

```astro
---
interface Props {
  date: Date;
}
const { date } = Astro.props;
---
<time datetime={date.toISOString()}>{date.toLocaleDateString('en-us', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})}</time>
```

### Reading Time Calculation (`src/utils/readingTime.ts`)

Sophisticated reading time estimation:

```typescript
export function formatReadingTime(text: string): string {
  // Text content: 200 words per minute
  // Code blocks: 50 words per minute
  // Returns: "📖 5 min read"
}
```

**Algorithm:**

1. Extract code blocks separately
2. Count words in regular text (200 WPM)
3. Count words in code (50 WPM)
4. Combine with weighted calculation
5. Format with emoji and readable text

### PostsManager Utility (`src/utils/postSorter.ts`)

Fluent API for content queries:

```typescript
const posts = new PostsManager(allPosts)
  .filter('featured')
  .sort('date-desc')
  .limit(3)
  .get()

// Static methods for common operations
PostsManager.getLatest(posts, 5)
PostsManager.getFeatured(posts)
PostsManager.getByCategory(posts, 'tutorial')
```

## SEO Optimization Strategy

### Meta Tags Implementation

```astro
<!-- BaseLayout.astro -->
<head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content="article" />
  <meta property="article:published_time" content={pubDate.toISOString()} />
  <meta name="twitter:card" content="summary_large_image" />
</head>
```

### Structured Data (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Post Title",
  "description": "Post description",
  "author": {
    "@type": "Person",
    "name": "Szymon Dzumak"
  },
  "datePublished": "2025-01-18",
  "dateModified": "2025-01-20"
}
```

### URL Structure

- Clean URLs: `/blog/post-slug`
- No date prefixes: Better for evergreen content
- Descriptive slugs: Reflect content, include keywords
- Canonical URLs: Prevent duplicate content issues

### Image Optimization

```astro
---
import { Image } from 'astro:assets';
import heroImage from './hero.jpg';
---

<Image
  src={heroImage}
  alt="Descriptive alt text"
  width={800}
  height={400}
  format="webp"
  loading="lazy"
/>
```

## Performance Guidelines

### Core Web Vitals Optimization

**Largest Contentful Paint (LCP) < 2.5s**

- Optimize hero images with WebP format
- Use appropriate image sizes (800px max width)
- Preload critical resources
- Minimize above-the-fold content

**First Input Delay (FID) < 100ms**

- Zero JavaScript by default
- Progressive enhancement for interactivity
- Defer non-critical scripts
- Use CSS for animations when possible

**Cumulative Layout Shift (CLS) < 0.1**

- Reserve space for images with width/height
- Avoid dynamic content insertion
- Use font-display: swap for web fonts
- Consistent component dimensions

### Build Performance

- **Content Collections**: 5x faster builds in Astro 5
- **Incremental Builds**: Only changed pages rebuild
- **Image Processing**: Parallel optimization
- **Bundle Splitting**: Route-based code splitting

### Runtime Performance

```astro
<!-- Zero JavaScript by default -->
<article class="article">
  <slot /> <!-- Pure HTML content -->
</article>

<!-- JavaScript only when needed -->
<InteractiveComponent client:load />
```

## Developer Workflow

### Creating New Posts

1. **Copy Template**
   ```bash
   cp src/content/blog/post-template.mdx src/content/blog/my-new-post.mdx
   ```

2. **Fill Required Fields**
   ```yaml
   title: 'Your Post Title'
   description: 'SEO description under 160 chars'
   pubDate: 'Jan 18 2025'
   category: 'tutorial'
   ```

3. **Set Draft Status**
   ```yaml
   draft: true # Hidden in production
   ```

4. **Preview Locally**
   ```bash
   deno task dev
   # Visit: http://localhost:4321/blog/my-new-post
   ```

5. **Publish**
   ```yaml
   draft: false # Make live
   ```

### Draft Management

- Drafts visible only in development (`import.meta.env.DEV`)
- Draft badge displayed in dev environment
- Excluded from production builds and sitemaps
- Can be previewed via direct URL in dev

### Quality Checklist

**Content**

- [ ] Title under 60 characters
- [ ] Description 120-160 characters
- [ ] Hero image optimized (<100KB)
- [ ] All links working
- [ ] Code blocks formatted
- [ ] Grammar and spelling checked

**Technical**

- [ ] Frontmatter validates against schema
- [ ] Reading time accurate (test with `deno task dev`)
- [ ] Images have descriptive alt text
- [ ] Internal links use relative paths
- [ ] Tags are relevant and consistent

**SEO**

- [ ] Keywords naturally integrated
- [ ] Meta description compelling
- [ ] Social sharing preview looks good
- [ ] URL slug is descriptive
- [ ] Related posts linked when relevant

### Publishing Workflow

1. **Local Testing**
   ```bash
   deno task dev          # Start dev server
   deno task check-all    # Run all quality checks
   ```

2. **Build Verification**
   ```bash
   deno task build       # Production build
   deno task preview     # Test production build
   ```

3. **Deploy**
   ```bash
   git add .
   git commit -m "feat: add new blog post about X"
   git push origin main  # Auto-deploy via GitHub Actions
   ```

## Advanced Features

### MDX Component Integration

````mdx
---
title: 'Interactive Tutorial'
category: 'tutorial'
---

import { Chart } from '@components/Chart.astro';
import { CodeDemo } from '@components/CodeDemo.tsx';

## Data Visualization

<Chart
  data={[1, 2, 3, 4, 5]}
  type="line"
  title="Performance Over Time"
/>

## Live Code Example

<CodeDemo client:load>
```javascript
const result = processData(input);
console.log(result);
````

</CodeDemo>
```

### Related Posts Algorithm

```typescript
// Automatic related posts based on:
// 1. Same category (highest weight)
// 2. Shared tags (medium weight)
// 3. Similar keywords (low weight)
// 4. Recent posts (fallback)

function getRelatedPosts(currentPost: Post, allPosts: Post[]): Post[] {
  return allPosts
    .filter((post) => post.slug !== currentPost.slug)
    .map((post) => ({
      post,
      score: calculateRelatedness(currentPost, post),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.post)
}
```

### Table of Contents Generation

```typescript
// Automatically generated from headings
const { headings } = await render(post)

// Structure:
// [
//   { depth: 2, slug: "introduction", text: "Introduction" },
//   { depth: 3, slug: "getting-started", text: "Getting Started" },
//   { depth: 2, slug: "advanced-topics", text: "Advanced Topics" }
// ]
```

## Performance Metrics & Monitoring

### Current Performance (as of 2025)

- **Lighthouse Score**: 98/100 (avg)
- **First Contentful Paint**: 0.8s
- **Time to Interactive**: 1.2s
- **Build Time**: 15s (for 50 posts)
- **Page Weight**: 45KB (avg, gzipped)

### Monitoring Setup

```typescript
// Core Web Vitals tracking
import { getCLS, getFCP, getFID, getLCP, getTTFB } from 'web-vitals'

getCLS(console.log)
getFID(console.log)
getFCP(console.log)
getLCP(console.log)
getTTFB(console.log)
```

### Performance Budget

- **HTML**: < 50KB gzipped
- **CSS**: < 20KB gzipped
- **Images**: < 100KB each
- **Build Time**: < 30s
- **LCP**: < 1.5s
- **FID**: < 50ms

## Troubleshooting

### Common Issues

**Schema Validation Errors**

```bash
Error: Invalid frontmatter for "my-post.mdx"
Expected string, received number for "title"
```

**Solution**: Ensure all string fields are quoted in YAML frontmatter.

**MDX Component Import Errors**

```bash
Error: Could not resolve "./components/MyComponent"
```

**Solution**: Use path aliases (`@components/MyComponent`) or relative paths from content directory.

**Reading Time Calculation Off**

```bash
Expected: 5 min read
Actual: 12 min read
```

**Solution**: Check for large code blocks (counted at 50 WPM vs 200 WPM for text).

**Build Performance Issues**

```bash
Build taking >2 minutes
```

**Solution**:

1. Check image sizes (resize large images)
2. Limit concurrent MDX processing
3. Use content collections instead of Glob imports

### Debug Commands

```bash
# Validate all content
deno task check-all

# Build with verbose output
deno task build --verbose

# Analyze bundle size
deno task build --analyze

# Test single post
deno task dev --filter="blog/specific-post"
```

## Future Enhancements

### Planned Features

- [ ] Automatic social media image generation
- [ ] A/B testing for titles and descriptions
- [ ] Reading progress indicator
- [ ] Comment system integration
- [ ] Content analytics dashboard
- [ ] AI-powered content suggestions

### Performance Targets (2025 Goals)

- [ ] Lighthouse score: 100/100
- [ ] Build time: <10s for 100 posts
- [ ] LCP: <1s
- [ ] Bundle size: <40KB gzipped

---

## Resources & References

- **[Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)** - Official documentation
- **[MDX Integration Guide](https://docs.astro.build/en/guides/integrations-guide/mdx/)** - MDX setup and usage
- **[Zod Schema Validation](https://zod.dev/)** - Type-safe schema validation
- **[Web Vitals](https://web.dev/vitals/)** - Performance measurement
- **[Schema.org](https://schema.org/BlogPosting)** - Structured data reference

**Internal References:**

- `src/content/config.ts` - Schema definitions
- `src/layouts/BlogPost.astro` - Main post layout
- `src/utils/readingTime.ts` - Reading time utility
- `src/utils/postSorter.ts` - PostsManager utility
- `CLAUDE.md` - Project guidelines and conventions

---

_This documentation is maintained as part of issue [#15](https://github.com/szymdzum/blog/issues/15). Last updated: January 2025._
