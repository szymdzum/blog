# Deployment & Configuration Guide

> Precise deployment information for kumak.dev on Deno Deploy Early Access

## Deno Deploy Early Access Overview

**What is EA?**  
Complete infrastructure revamp with enhanced NPM compatibility, integrated build system, and improved global distribution.

**Key Features:**
- **Build System**: Automated deployment via GitHub Actions + deployctl
- **NPM Compatibility**: Enhanced web framework support (Astro, Next, etc.)
- **Infrastructure**: 6 global regions (vs 2 in Classic)
- **Observability**: Built-in OpenTelemetry integration
- **Performance**: ~50% faster builds, ~50% faster cold starts

**Dashboard**: https://console.deno.com (EA) vs https://dash.deno.com (Classic)

## Current Infrastructure

### EA Project Configuration

```
Project: devblog
Organization: szymdzum  
Dashboard: https://console.deno.com/szymdzum/devblog
Regions: 6 worldwide
Performance: <9ms avg latency, 0.00% error rate
```

### Domains & SSL

```
Primary: kumak.dev → alias.deno.net (Cloudflare proxied)
WWW: www.kumak.dev → kumak.dev (Cloudflare proxied)  
SSL: Let's Encrypt auto-renewal (60-day cycle)
TLS: 1.3 with modern cipher suites
```

### DNS Records (Cloudflare)

```
kumak.dev       CNAME  alias.deno.net          (proxied ✅)
www.kumak.dev   CNAME  kumak.dev               (proxied ✅)
_acme-challenge CNAME  *.acme.deno.net         (SSL validation)
```

## Deployment Pipeline

### GitHub Actions Integration

**File**: `.github/workflows/ci.yml`

**Triggers:**
- Push to `main` branch
- Pull requests to `main`

**Pipeline Flow:**

```
Code Push → Quality Gates → deployctl → Deno Deploy EA → Live Site
    ↓           ↓              ↓           ↓               ↓
GitHub     Lint, Format,   Deploy     Build &          kumak.dev
           Build Check      Action     Distribute       (6 regions)
```

**Permissions:**
```yaml
permissions:
  contents: read      # Read repository code
  id-token: write     # OIDC token for Deno Deploy auth
```

**Job Steps:**

1. **Checkout**: `actions/checkout@v4`
2. **Setup Deno**: `denoland/setup-deno@v1` (v2.x)
3. **Setup Node.js**: `actions/setup-node@v4` (Node 20)
4. **Install Dependencies**: `npm ci`
5. **Lint**: `deno lint` (79 rules)
6. **Format Check**: `deno fmt --check`
7. **Build**: `deno task build` (static site to dist/)
8. **Deploy**: `denoland/deployctl@v1` (main branch only)

**Deployment Configuration:**
```yaml
- name: Deploy to Deno Deploy
  if: github.ref == 'refs/heads/main'
  uses: denoland/deployctl@v1
  with:
    project: devblog
    entrypoint: https://deno.land/std/http/file_server.ts
    root: dist
```

**Authentication**: OIDC tokens (no manual DENO_DEPLOY_TOKEN needed)

### Performance Metrics

```
Checkout + Setup:  ~15 seconds
Install + Lint:    ~10 seconds
Format + Build:    ~30 seconds
Deploy:            ~30 seconds
Total Pipeline:    <2 minutes
Success Rate:      100%
```

## Configuration Files

### Astro Configuration

**File**: `astro.config.mjs`

```javascript
export default defineConfig({
  site: 'https://kumak.dev',
  output: 'static',              // Static site generation
  integrations: [mdx(), sitemap()],
  compressHTML: true,
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport'
  },
  build: {
    inlineStylesheets: 'never'   // Manual inlining via Head.astro
  },
  vite: {
    build: {
      cssMinify: true
    }
  }
})
```

**Key Features:**
- Static site generation (no SSR)
- MDX support for interactive content
- Automatic sitemap generation
- HTML compression
- Viewport-based prefetching
- CSS minification

### Deno Configuration

**File**: `deno.json`

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
  "fix": "deno lint --fix && deno fmt"
}
```

**JSR Imports:**
```json
{
  "zod": "jsr:@zod/zod@^4.1.8",
  "@std/fs": "jsr:@std/fs@^1.0.19",
  "@std/path": "jsr:@std/path@^1.1.2",
  "@std/assert": "jsr:@std/assert@^1.0.14"
}
```

**Note**: No `@astrojs/check` in tasks - removed from dependencies.

### Environment Configuration

**File**: `.env.example`

```bash
SITE_URL=https://kumak.dev
GITHUB_TOKEN=ghp_optional_for_automation
```

**Important**: Deno Deploy uses OIDC authentication via GitHub Actions. No manual `DENO_DEPLOY_TOKEN` required.

## Security & Access Control

### Cloudflare Configuration

```
SSL/TLS Mode: Full (Strict)
Always Use HTTPS: Disabled (prevents redirect conflicts with Deno Deploy)
Proxy Status: Enabled (orange cloud ✅)
DNSSEC: Disabled (not compatible with CNAME to alias.deno.net)
```

### GitHub Integration

```
Authentication: OIDC tokens (id-token: write permission)
Access: GitHub Actions workflow has deploy permissions
Secrets: No manual tokens in repository secrets
Deployment: Automatic on main branch push
```

### Access Tokens (for reference)

**Deno Deploy** (not used in CI/CD):
- OIDC authentication handles deployment
- Manual token only for `deployctl` CLI outside GitHub Actions

**Cloudflare API** (for DNS management):
- Scoped to DNS zone edit permissions only
- Used for manual DNS updates (not automated)

## Deployment Commands

### Development Workflow

```bash
# Local development
deno task dev              # http://localhost:4321

# Quality assurance
deno task check-all        # Lint + format check
deno task fix              # Auto-fix lint/format issues

# Build verification
deno task build            # Test production build locally
deno task preview          # Preview production build
```

### Production Deployment

```bash
# Automated deployment (recommended)
git push origin main       # Triggers CI/CD → Deploy to EA

# Manual deployment (for emergencies)
npm run build              # Build dist/
deployctl deploy \
  --project=devblog \
  --entrypoint=https://deno.land/std/http/file_server.ts \
  --root=dist
```

### Monitoring & Verification

```bash
# Check CI/CD status
gh run list --workflow=CI --limit=5

# View deployment logs
gh run view --log

# Check live site
curl -I https://kumak.dev

# Verify SSL
openssl s_client -connect kumak.dev:443 -servername kumak.dev
```

## Troubleshooting

### Build Failures

**Symptom**: CI fails at build step

**Resolution**:
```bash
# Run quality gates locally
deno task check-all

# Test build locally
deno task build

# Check for type errors (build shows TypeScript errors)
deno task build 2>&1 | grep -i error
```

### Deployment Failures

**Symptom**: deployctl step fails in GitHub Actions

**Check**:
1. Verify `id-token: write` permission in workflow
2. Check Deno Deploy dashboard for quota limits
3. Verify project name is `devblog`
4. Check if dist/ was created in build step

**Logs**: https://console.deno.com/szymdzum/devblog → Deployments

### SSL/Domain Issues

**Symptom**: SSL certificate errors or domain not resolving

**Resolution**:
```bash
# Check DNS propagation
dig kumak.dev
dig www.kumak.dev

# Verify CNAME records point to alias.deno.net
dig kumak.dev CNAME

# Check SSL certificate
curl -vI https://kumak.dev 2>&1 | grep -i "SSL certificate"
```

### Performance Issues

**Symptom**: Slow response times

**Check**:
1. Deno Deploy console metrics (https://console.deno.com)
2. Cloudflare analytics for cache hit rate
3. Build size (dist/ directory size)

**Optimization**:
```bash
# Check build size
du -sh dist/

# Analyze bundle
deno task build && ls -lh dist/_astro/
```

## Migration Notes

### EA vs Classic Deploy

| Feature | Classic Deploy | EA Deploy |
|---------|---------------|-----------|
| Build System | Manual deployctl | GitHub Actions + deployctl |
| Regions | 2 | 6 |
| Authentication | Manual tokens | OIDC (GitHub Actions) |
| Observability | Basic logs | OpenTelemetry |
| Cold Start | ~100ms | ~50ms |
| Build Speed | Baseline | ~50% faster |

### Legacy Cleanup (Completed)

```
✅ devblog-kumak Classic project deleted
✅ Legacy deployctl commands removed from workflows
✅ Manual deploy tokens removed from secrets
✅ Environment variables updated for EA
✅ Zero legacy dependencies
```

## Cost Structure

### Current Usage (Free Tiers)

```
GitHub Actions:  <100 min/month (of 2,000 free)
Deno Deploy EA:  Free tier (well within limits)
Cloudflare:      Free plan (sufficient for traffic)
Total Cost:      $0/month
```

### Scaling Projections

```
10x Traffic:     Still free tier
100x Traffic:    ~$20/month (Deno Deploy Pro)
Enterprise:      Custom pricing as needed
```

## Available EA Features

### Active Features

- ✅ Static site generation (Astro)
- ✅ Multi-region deployment (6 regions)
- ✅ Auto SSL certificate renewal
- ✅ GitHub Actions CI/CD integration
- ✅ OIDC authentication
- ✅ HTML compression
- ✅ Viewport-based prefetching

### Available (Not Yet Used)

- 🔄 **Cron Jobs**: Scheduled tasks for content updates
- 🔄 **Edge Functions**: Dynamic content generation at edge
- 🔄 **KV Storage**: Key-value data persistence
- 🔄 **Queues**: Background job processing
- 🔄 **OpenTelemetry**: Advanced observability and tracing

## Best Practices

### Development Workflow

1. **Feature branches**: Never commit directly to main
2. **Quality gates**: Run `deno task check-all` before pushing
3. **Preview builds**: Use `deno task preview` to test locally
4. **Documentation**: Update DEPLOYMENT_GUIDE.md for infrastructure changes

### Security Practices

1. **No tokens in code**: Use GitHub Secrets for sensitive data
2. **OIDC preferred**: Leverage GitHub Actions OIDC over manual tokens
3. **Scoped permissions**: Minimal required access for tokens
4. **Regular audits**: Review access logs in Deno Deploy console

### Performance Optimization

1. **Static generation**: Leverage Astro's static output (no SSR overhead)
2. **Asset optimization**: Minify CSS/HTML, compress images
3. **Caching**: Cloudflare edge caching + browser caching headers
4. **Monitoring**: Track metrics in Deno Deploy console regularly

### Debugging

```bash
# Local debugging workflow
deno task dev              # Test locally first
deno task check-all        # Run all quality gates
deno task build            # Verify build succeeds
deno task preview          # Test production build locally

# If CI fails, reproduce locally
git checkout <failing-branch>
deno task check-all        # Should show same errors
```

## Deployment Checklist

Before pushing to main:

- [ ] `deno task check-all` passes locally
- [ ] `deno task build` completes successfully
- [ ] `deno task preview` shows expected changes
- [ ] Environment variables updated (if needed)
- [ ] Documentation updated for infrastructure changes

After deployment:

- [ ] Verify https://kumak.dev loads correctly
- [ ] Check Deno Deploy console for errors
- [ ] Monitor Cloudflare analytics for anomalies
- [ ] Test navigation and interactive features

---

**Last Updated**: November 16, 2025  
**EA Project**: `szymdzum/devblog`  
**Status**: Production-ready, OIDC-authenticated deployments
