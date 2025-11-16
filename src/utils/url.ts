/**
 * Route builder for type-safe URL generation
 */
export class RouteBuilder {
  private base: string
  private segments: string[] = []

  constructor(base = '') {
    this.base = base ? (base.startsWith('/') ? base : `/${base}`) : ''
  }

  /**
   * Add a segment to the route
   * @param segment - URL segment to add
   */
  segment(segment: string): RouteBuilder {
    if (!segment) throw new Error('Segment cannot be empty')

    // Encode the segment to handle special characters safely
    const encoded = encodeURIComponent(segment.replace(/\//g, ''))
    this.segments.push(encoded)
    return this
  }

  /**
   * Build the final URL path
   * @param trailingSlash - Whether to add trailing slash (default: true)
   */
  build(trailingSlash = true): string {
    const parts = [this.base, ...this.segments].filter((part) => part.length > 0)
    const path = parts.join('/')
    const finalPath = path.startsWith('/') ? path : `/${path}`
    return trailingSlash ? `${finalPath}/` : finalPath
  }

  /**
   * Build as URL object for additional validation
   * @param baseUrl - Base URL for absolute URLs
   */
  toURL(baseUrl?: string): URL {
    const path = this.build()
    return baseUrl ? new URL(path, baseUrl) : new URL(path, 'http://localhost')
  }
}

/**
 * Blog-specific URL builders
 */
export const BlogRoutes = {
  /**
   * Generate blog post URL
   * @param slug - Post slug
   */
  post(slug: string): string {
    return new RouteBuilder('blog').segment(slug).build()
  },

  /**
   * Generate blog category URL
   * @param category - Category name
   */
  category(category: string): string {
    return new RouteBuilder('blog').segment('category').segment(category).build()
  },

  /**
   * Generate blog tag URL
   * @param tag - Tag name
   */
  tag(tag: string): string {
    return new RouteBuilder('blog').segment('tag').segment(tag).build()
  },

  /**
   * Blog index URL
   */
  index(): string {
    return new RouteBuilder('blog').build()
  },
} as const
