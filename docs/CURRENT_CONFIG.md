# Current Blog Configuration

**Documentation Date**: November 16, 2025  
**Status**: ✅ Deno Deploy Early Access - Production Ready  
**Site**: https://kumak.dev  

## 🎯 System Overview

The blog runs on **Deno Deploy Early Access** with automated CI/CD, delivering a high-performance static site with modern infrastructure and zero legacy dependencies.

### Architecture Summary
```
GitHub Repository → GitHub Actions → Deno Deploy EA → Cloudflare CDN → Global Users
     (Source)         (CI/CD)         (Hosting)        (Edge Cache)     (Delivery)
```

## 🚀 Deployment Infrastructure

### Deno Deploy Early Access
- **Platform**: console.deno.com (EA)
- **Project**: `devblog`
- **Organization**: `szymdzum`
- **Build System**: deployctl via GitHub Actions
- **Regions**: 6 worldwide regions
- **Performance**: <9ms avg latency, 0.00% error rate

### Domain Configuration
- **Primary**: kumak.dev
- **WWW**: www.kumak.dev  
- **SSL**: Let's Encrypt (auto-renewed)
- **DNS Provider**: Cloudflare
- **CDN**: Cloudflare proxy enabled

## 📁 Project Structure

```
blog/
├── src/                        # Source code
│   ├── components/            # 6 Astro components (316 LOC)
│   ├── content/               # Blog posts & content collections
│   │   ├── config.ts          # Zod content schemas
│   │   └── blog/              # 2 blog posts (MDX + Markdown)
│   ├── layouts/               # 1 layout (BaseLayout.astro)
│   ├── pages/                 # 4 pages (index, about, [...slug], rss.xml)
│   ├── styles/                # global.css (248 LOC - tokens only)
│   ├── utils/                 # 1 utility (path.ts)
│   └── site-config.ts         # Site metadata
├── .github/workflows/          # CI/CD automation (ci.yml)
├── dist/                       # Build output (generated)
├── node_modules/               # Dependencies (generated)
├── astro.config.mjs           # Astro configuration
├── deno.json                  # Deno project configuration
├── package.json               # npm dependencies
├── tsconfig.json              # TypeScript configuration
└── knip.config.ts             # Unused code detection
```

### Components (src/components/)

**6 Components, 316 LOC total:**
- **BlogPostCard.astro** - Blog post preview cards
- **Footer.astro** - Site footer with social links
- **FormattedDate.astro** - Date formatting utility
- **Head.astro** - HTML head with meta tags
- **Hero.astro** - Homepage hero section
- **NavBar.astro** - Navigation bar

### Pages (src/pages/)

**4 Pages, 156 LOC total:**
- **index.astro** - Homepage with hero and post list
- **about.astro** - About page
- **[...slug].astro** - Dynamic blog post pages
- **rss.xml.js** - RSS feed generation

### Utilities (src/utils/)

**1 Utility:**
- **path.ts** - Active link detection for navigation
  - Function: `isPathActive(currentPath, targetPath): boolean`

## ⚙️ Configuration Files

### Astro Configuration (astro.config.mjs)

```javascript
export default defineConfig({
  site: 'https://kumak.dev',
  output: 'static',
  integrations: [mdx(), sitemap()],
  compressHTML: true,
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport'
  },
  build: {
    inlineStylesheets: 'never'
  },
  vite: {
    build: {
      cssMinify: true
    }
  }
})
```

**Key Features:**
- Static site generation (SSG)
- MDX support for interactive content
- Automatic sitemap generation
- HTML compression enabled
- Viewport-based prefetching
- CSS minification

### Deno Configuration (deno.json)

**JSR Imports:**
```json
{
  "zod": "jsr:@zod/zod@^4.1.8",
  "@std/fs": "jsr:@std/fs@^1.0.19",
  "@std/path": "jsr:@std/path@^1.1.2",
  "@std/assert": "jsr:@std/assert@^1.0.14"
}
```

**Path Aliases:**
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

**Tasks:**
```json
{
  "dev": "./node_modules/.bin/astro dev",
  "build": "./node_modules/.bin/astro build",
  "preview": "deno task preview-urls && deno task preview-serve",
  "preview-serve": "deno run --allow-net --allow-read jsr:@std/http/file-server dist --port 4321",
  "lint": "deno lint",
  "format": "deno fmt",
  "check": "deno lint && deno fmt --check",
  "check-all": "deno lint && deno fmt --check",
  "knip": "npx knip",
  "fix": "deno lint --fix && deno fmt"
}
```

**Lint Configuration (79 rules):**
- Base: `recommended` tags
- Strict rules: `ban-untagged-todo`, `eqeqeq`, `no-await-in-loop`, `no-eval`, `no-explicit-any`, `prefer-const`
- Exclusions: `no-inferrable-types`, `triple-slash-reference`

**Format Configuration:**
- Line width: 100 characters
- Indentation: 2 spaces (no tabs)
- Quotes: Double (`"`)
- Semicolons: Required
- Prose wrap: Preserve

**Compiler Options:**
- Strict mode: All strict flags enabled
- `noImplicitAny`: true
- `exactOptionalPropertyTypes`: true
- `noUncheckedIndexedAccess`: true
- JSX: react-jsx with Astro import source

### Package Configuration (package.json)

**Dependencies (7 packages):**
```json
{
  "@astrojs/mdx": "^4.3.4",
  "@astrojs/rss": "^4.0.12",
  "@astrojs/sitemap": "^3.5.1",
  "@deno/astro-adapter": "^0.3.1",
  "astro": "^5.13.7",
  "astro-icon": "^1.1.5",
  "typescript": "^5.9.2"
}
```

**Dev Dependencies (1 package):**
```json
{
  "knip": "^5.69.1"
}
```

### Environment Configuration (.env.example)

```bash
SITE_URL=https://kumak.dev
GITHUB_TOKEN=ghp_your_token_here
```

**Note:** Deno Deploy EA uses GitHub integration - manual tokens not required for deployment.

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow (.github/workflows/ci.yml)

**Triggers:**
- Push to `main` branch
- Pull requests to `main` branch

**Permissions:**
- `contents: read`
- `id-token: write` (for Deno Deploy OIDC)

**Steps:**
1. Checkout repository (`actions/checkout@v4`)
2. Setup Deno v2.x (`denoland/setup-deno@v1`)
3. Setup Node.js 20 (`actions/setup-node@v4`)
4. Install dependencies (`npm ci`)
5. Lint code (`deno lint`)
6. Format check (`deno fmt --check`)
7. Build production (`deno task build`)
8. Deploy to Deno Deploy (main branch only)

**Deployment Configuration:**
- Action: `denoland/deployctl@v1`
- Project: `devblog`
- Entrypoint: `https://deno.land/std/http/file_server.ts`
- Root: `dist/`
- Method: OIDC authentication

**Build Performance:**
- Lint + Format: <10 seconds
- Build: ~30 seconds
- Deployment: ~30 seconds
- **Total Pipeline**: <2 minutes

## 🌐 DNS & Domain Configuration

### Cloudflare DNS Records
```
kumak.dev       → CNAME → alias.deno.net (proxied ✅)
www.kumak.dev   → CNAME → kumak.dev (proxied ✅)
_acme-challenge → CNAME → *.acme.deno.net (SSL verification)
```

### SSL/TLS Configuration
- **Mode**: Full (Strict)
- **Certificates**: Let's Encrypt via Deno Deploy
- **Auto-Renewal**: 60-day cycle
- **TLS Version**: 1.3
- **HSTS**: Available via Cloudflare

## 📊 Performance Configuration

### Build Optimization
- **HTML**: Compressed and minified
- **CSS**: Minified, manual inlining via Head.astro
- **JavaScript**: Minimized bundle size
- **Assets**: Cache-optimized file naming with hashes
- **Prefetching**: Viewport-based for instant navigation

### Caching Strategy
- **Cloudflare**: Edge caching globally
- **Browser**: Long-term caching for static assets
- **Build**: Incremental when possible

### Performance Metrics
- **Response Time**: <9ms average (Deno Deploy EA)
- **Error Rate**: 0.00%
- **Availability**: Multi-region redundancy (6 regions)
- **Build Time**: ~30 seconds

## 🔐 Security Configuration

### Access Control
- **GitHub**: Repository access via SSH keys
- **Deno Deploy**: OIDC token authentication (no manual tokens)
- **Cloudflare**: Scoped API tokens

### Content Security
- **HTTPS**: Enforced
- **SSL**: TLS 1.3, modern cipher suites
- **Headers**: Security headers via Cloudflare
- **Dependencies**: Regular npm audit

### Secrets Management
- **GitHub Secrets**: Used for CI/CD
- **Environment Variables**: Managed in Deno Deploy console
- **No Plain Text**: All sensitive data secured

## 💰 Cost Structure

### Current Usage (All Free Tiers)
- **GitHub Actions**: <100 minutes/month (of 2,000 available)
- **Deno Deploy EA**: Free tier
- **Cloudflare**: Free plan
- **Total Monthly Cost**: $0

### Scaling Projections
- **10x Traffic**: Within free tiers
- **100x Traffic**: ~$20/month (Deno Deploy Pro)

## 🔮 Active Features

### Currently Implemented
- ✅ Static site generation (Astro 5.13.7)
- ✅ MDX content with inline components
- ✅ Automated sitemap generation
- ✅ RSS feed at /rss.xml
- ✅ Multi-region deployment (6 regions)
- ✅ Auto SSL certificate renewal
- ✅ GitHub Actions CI/CD
- ✅ Viewport-based prefetching
- ✅ HTML compression

### Available But Not Used
- 🔄 Cron Jobs (scheduled tasks)
- 🔄 Edge Functions (dynamic content)
- 🔄 KV Storage (key-value data)
- 🔄 Queues (background jobs)
- 🔄 OpenTelemetry (advanced monitoring)

## 📈 Monitoring & Analytics

### Available Dashboards
- **Deno Deploy Console**: https://console.deno.com (metrics, logs, traces)
- **GitHub Actions**: CI/CD status and history
- **Cloudflare**: DNS, CDN, security analytics

### Key Metrics
- **Build Success Rate**: 100%
- **Deployment Time**: <2 minutes
- **Site Availability**: 100% (multi-region)
- **Response Time**: <9ms average
- **Error Rate**: 0.00%

## 🛠️ Development Workflow

### Local Development
```bash
# Start dev server (http://localhost:4321)
deno task dev

# Run quality checks
deno task check-all           # Lint + format check

# Auto-fix issues
deno task fix                 # Lint --fix + format

# Preview production build
deno task build && deno task preview

# Analyze unused code
deno task knip
```

### Deployment Process
```bash
# Automatic deployment:
git push origin main
# → Lint + format + build checks
# → Deploy to Deno Deploy EA
# → Live at https://kumak.dev
```

### Content Management
```bash
# Add new blog post
src/content/blog/new-post.mdx

# Update navigation (if needed)
src/site-config.ts

# Modify layout
src/layouts/BaseLayout.astro
```

## 📝 Content Schema (Zod)

**Blog Post Frontmatter:**
```typescript
{
  title: string,              // Required
  description: string,        // Required
  pubDate: Date,              // Required
  updatedDate?: Date,
  heroImage?: string,
  draft: boolean,             // Default: false
  category: "tutorial" | "opinion" | "project" | "philosophy",
  tags: string[],             // Default: []
  keywords?: string[],
  author: string,             // Default: "Szymon Dzumak"
  showToc: boolean,           // Default: false
  featured: boolean,          // Default: false
  minutesToRead?: number,
  relatedPosts?: string[],
  externalLinks?: Array<{title: string, url: string}>
}
```

## 📚 Documentation Resources

### Project Documentation
- `README.md` - Project overview and setup
- `CLAUDE.md` - AI assistant guidelines
- `WARP.md` - Warp terminal integration
- `docs/CURRENT_CONFIG.md` - This file
- `docs/DENO_CONFIG.md` - Deno configuration details
- `docs/DEPLOYMENT_GUIDE.md` - Deployment procedures
- `docs/CODE_GUIDE.md` - Code patterns and best practices

### External Resources
- [Deno Deploy Documentation](https://docs.deno.com/deploy/)
- [Astro Documentation](https://docs.astro.build/)
- [Cloudflare Documentation](https://developers.cloudflare.com/)

---

**Last Updated**: November 16, 2025  
**Configuration Status**: ✅ Production Ready  
**Next Review**: December 2025 (or after major changes)
