# Features Changelog

All features implemented across phases (2026-10-01).

---

## ✅ Bug Fix: Horizontal Overflow (White Strip)

| Fix | Files |
|-----|-------|
| `overflow-x: hidden` on `html`, `body`, `#root` | `src/App.css` |
| Pseudo-elements capped at `100vw` (`min()/max()`) | `Projects.css`, `Contact.css`, `Skills.css`, `Experience.css`, `SuccessStories.css` |
| Grid `minmax(300px,1fr)` → `minmax(min(300px,100%),1fr)` | All grid sections |

---

## Phase 1 — High Impact

### 1. SEO & Social Sharing
- **`index.html`** — full meta tags: Open Graph, Twitter Cards, canonical, theme-color, JSON-LD `Person` structured data, DNS prefetch
- **`src/components/SEO.jsx`** — `useSEO(section)` hook updates title/description/OG tags dynamically per section
- **`scripts/generate-seo.js`** — generates `sitemap.xml` + `robots.txt` (runs on `npm run build`)

### 2. Analytics
- **`src/components/Analytics.jsx`** — supports **Plausible**, **Umami**, **GA4** via env vars
- Tracks: page views (SPA hash nav), scroll depth, time on page, external link clicks, form submissions, file downloads
- **`@vercel/speed-insights`** already integrated
- **`.env.example`** — documents all analytics keys

### 3. Form Enhancements (backend)
- **`api/validation.js`** — Zod schemas (strict email rules, disposable-domain blocking, length limits)
- **`api/send-email-handler.js`** — shared handler: rate limiting (5 req/15min/IP → 429 + `Retry-After`), captcha, validation, send
- **`api/captcha.js`** — hCaptcha server-side verification (optional)
- **`api/notify.js`** — Slack + Discord webhook notifications
- **`api/templates.js`** — branded HTML email templates + optional auto-reply
- Wired into `dev-server.js`, `prod-server.js`, Vercel `api/send-email.js`

### 4. Theme Customization
- **`src/context/ThemeContext.jsx`** — dark/light with `prefers-color-scheme` detection, 8 accent colors, localStorage persistence
- **`src/components/ThemeCustomizer.jsx`** — floating color-picker button (bottom-right)
- Accent applied via CSS custom properties (`--accent`, `--accent-2`)

---

## Phase 2 — Medium Effort

### 5. Accessibility (a11y)
- Skip-to-content link (visible on focus)
- `:focus-visible` keyboard outlines
- `prefers-reduced-motion` — disables all animations
- `forced-colors` (high contrast) support
- ARIA: `aria-label`, `aria-current`, `aria-expanded`, `aria-pressed`, `aria-live` status regions
- `.sr-only` utility + labels on form inputs
- Touch targets ≥44px for primary controls

### 6. Blog (MDX)
- **`vite.config.js`** — `@mdx-js/rollup` + `remark-gfm` + `rehype-slug` + `rehype-pretty-code` (Shiki syntax highlighting)
- **`src/blog/*.mdx`** — 3 starter posts (Kubernetes, GitHub Actions, Linux Hardening) with exported metadata
- **`src/components/Blog.jsx`** — list view (search + tag filter), single-post view, deep links (`#blog-slug`), reading time, analytics events
- Added to Navigation + SEO section map

### 7. Student Resources Upgrade
- Search with 250ms debounce
- Live results count (`aria-live`)
- Download analytics tracking
- **"Request a Resource"** form → pre-fills contact form via custom event

---

## Phase 3 — Higher Effort

### 8. PWA Support
- **`public/manifest.webmanifest`** — app icons, shortcuts (Contact/Projects/Blog), standalone display
- **`public/sw.js`** — strategies: cache-first (hashed assets), network-first (navigation), stale-while-revalidate (images/fonts), offline fallback
- **`src/components/PWARegister.jsx`** — production-only SW registration with update detection

### 9. Visual Polish
- **`src/components/ScrollProgress.jsx`** — gradient progress bar at top (supports both window and container scroll), `role="progressbar"`

---

## Round 2 — Remaining Items (all completed)

### 10. Particle Background ✅
- **`src/components/ParticleBackground.jsx`** — canvas network animation in Hero
- Respects `prefers-reduced-motion` (static frame), auto-pauses when tab hidden, fewer particles on mobile, follows accent color, DPR-aware

### 11. Page Transitions ✅
- **`src/components/ScrollReveal.jsx`** — fade/slide-in on scroll (direction + delay props)
- Section enter animation in `ScrollReveal.css`
- Hero content wrapped with staggered reveal delays
- Reduced-motion: content shows instantly

### 12. Micro-interactions ✅
- Press-down feedback on all buttons
- Shine sweep on primary buttons (hover)
- Nav link animated underline
- Contact icon slide on hover
- Smooth theme/color transitions

### 13. PWA Install Prompt ✅
- **`src/components/InstallPrompt.jsx`** — captures `beforeinstallprompt`, floating install button (bottom-left), dismissible (sessionStorage), hidden in standalone mode

### 14. hCaptcha Frontend ✅
- **`src/components/HCaptcha.jsx`** — lazy-loads widget only when `VITE_HCAPTCHA_SITE_KEY` is set (no-op otherwise)
- Wired into Contact form; token sent as `captchaToken` to backend

### 15. ARIA/a11y Audit ✅
- **`src/a11y.test.jsx`** — axe-core audit via `vitest-axe`: **0 violations**
- Asserts nav ARIA structure, `aria-expanded`, `aria-pressed`, skip link, image alt text
- Note: vitest-axe 0.1.0 ships an empty `extend-expect.js` — matcher registered manually from `vitest-axe/matchers`

### 16. CMS Integration ✅
- **`api/resources-handler.js`** — `GET /api/resources` serves from **Notion** (`NOTION_TOKEN` + `NOTION_DATABASE_ID`) or **Airtable** (`AIRTABLE_API_KEY` + `AIRTABLE_BASE_ID`), 5-min cache, **static fallback** if unconfigured
- Routes wired: `dev-server.js`, `prod-server.js`, Vercel `api/resources.js`
- **`src/hooks/useResources.js`** — frontend hook with graceful static fallback
- Secrets stay **server-side** (never exposed to browser)
- `StudentResources.jsx` now data-source agnostic

---

## Verification (final)

```
npm run build    ✅ succeeds (incl. SEO generation)
npx vitest run   ✅ 30/30 tests pass (27 app + 3 axe-core a11y)
Prod server      ✅ 200 for /, sitemap, robots, manifest, sw.js, /api/resources
API              ✅ 400 validation, 429 rate limit, friendly 500 when unconfigured
a11y audit       ✅ axe-core: 0 violations
```

**24/24 items from the original feature list — all complete.**

## Setup Notes

Copy `.env.example` → `.env` and fill in:
- `GMAIL_USER` + `GMAIL_APP_PASSWORD` (required for email)
- Any analytics provider key (Plausible / Umami / GA4)
- Optional: `VITE_HCAPTCHA_SITE_KEY` + `HCAPTCHA_SECRET_KEY`, `SLACK_WEBHOOK_URL`, `DISCORD_WEBHOOK_URL`, `ENABLE_AUTO_REPLY`
- Optional CMS: `NOTION_TOKEN` + `NOTION_DATABASE_ID` OR `AIRTABLE_API_KEY` + `AIRTABLE_BASE_ID` (else static fallback)