# Blog Utilities

This directory contains utility functions for the Astro blog project.

## Available Utilities

### path.ts

Active link detection utility for navigation components.

**Function**: `isPathActive(currentPath: string, targetPath: string): boolean`

**Purpose**: Determines if a navigation link should be marked as active based on the current page path.

**Logic**:

- Returns `true` if `currentPath` exactly matches `targetPath`
- Handles root path (`/`) specially - only active on homepage
- Normalizes trailing slashes for consistent comparison
- Supports nested route matching (e.g., `/blog/post` matches `/blog`)

**Usage Example**:

```astro
---
import { isPathActive } from "@utils/path";

const currentPath = Astro.url.pathname;
const navItems = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
];
---

<nav>
  {navItems.map(({ title, href }) => (
    <a 
      href={href}
      aria-current={isPathActive(currentPath, href) ? "page" : undefined}
    >
      {title}
    </a>
  ))}
</nav>
```

**Implementation Details**:

```typescript
export function isPathActive(currentPath: string, targetPath: string): boolean {
  // Root path only active on homepage
  if (targetPath === "/") {
    return currentPath === "/";
  }

  // Normalize trailing slashes
  const normalizedCurrent = currentPath.replace(/\/$/, "");
  const normalizedTarget = targetPath.replace(/\/$/, "");

  // Check exact match or nested route
  return normalizedCurrent === normalizedTarget ||
    normalizedCurrent.startsWith(normalizedTarget + "/");
}
```

## Content Queries

For blog post queries, use Astro's built-in `getCollection()` function with standard JavaScript array methods:

```typescript
import { getCollection } from "astro:content";

// Get all published posts
const posts = await getCollection("blog", ({ data }) => !data.draft);

// Sort by date (newest first)
const sortedPosts = posts.sort(
  (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime(),
);

// Filter by tag
const taggedPosts = posts.filter(({ data }) => data.tags.includes("typescript"));

// Get featured posts
const featuredPosts = posts
  .filter(({ data }) => data.featured)
  .slice(0, 3);

// Get posts by category
const tutorials = posts.filter(({ data }) => data.category === "tutorial");
```

## Content Schema

Content validation is handled by Zod schemas in `src/content/config.ts`:

```typescript
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
```

## Adding New Utilities

When adding new utilities:

1. Create a new `.ts` file in `src/utils/`
2. Export functions with explicit TypeScript types
3. Use `readonly` for immutable parameters
4. Follow strict TypeScript rules (no `any` types)
5. Add JSDoc comments for complex logic
6. Update this README with usage examples

**Example template**:

```typescript
/**
 * Utility function description
 *
 * @param input - Description of input parameter
 * @returns Description of return value
 */
export function utilityName(input: string): boolean {
  // Implementation
  return true;
}
```

## Path Aliases

Utilities can be imported using the `@utils` path alias:

```typescript
import { isPathActive } from "@utils/path";
```

Configured in:

- `deno.json`: `"@utils/*": "./src/utils/*"`
- `tsconfig.json`: Same mapping for editor support

---

**Last Updated**: November 16, 2025
