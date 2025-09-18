# Blog Images Directory

This directory contains organized images for blog posts following a structured naming convention.

## Directory Structure

```
/blog/images/
├── README.md                 # This file
├── hero-image.jpg           # Default hero image (template)
├── example-screenshot.jpg   # Example screenshot placeholder
├── tutorial-hero.jpg        # Tutorial category hero image
├── opinion-hero.jpg         # Opinion category hero image
├── project-hero.jpg         # Project category hero image
├── philosophy-hero.jpg      # Philosophy category hero image
├── mdx-demo.jpg            # MDX demonstration post image
└── markdown-guide.jpg       # Markdown guide post image
```

## Usage Guidelines

### Image References

- All blog post images should use paths relative to `/blog/images/`
- Example: `heroImage: '/blog/images/tutorial-hero.jpg'`

### Naming Conventions

- **Category-specific**: `{category}-hero.jpg` for default category images
- **Post-specific**: `{post-slug}-{description}.jpg` for post-specific images
- **Generic**: Descriptive names like `example-screenshot.jpg`

### Image Specifications

- **Format**: JPG, PNG, or WebP preferred
- **Size**: Maximum 800px width for hero images
- **Optimization**: Keep file sizes under 100KB when possible
- **Alt text**: Always provide descriptive alt text for accessibility

### Hero Image Fallbacks

If no specific hero image is provided, use category defaults:

- Tutorial posts: `tutorial-hero.jpg`
- Opinion posts: `opinion-hero.jpg`
- Project posts: `project-hero.jpg`
- Philosophy posts: `philosophy-hero.jpg`

## Adding New Images

1. Add image files to this directory
2. Use descriptive, kebab-case filenames
3. Update blog post frontmatter with correct path
4. Test in development server before publishing

---

_This structure helps maintain organized, scalable image management for the blog._
