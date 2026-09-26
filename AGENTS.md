# WindKode — AGENTS.md

## Quick Reference

**Project:** Vue 3 + TypeScript + Vite + TailwindCSS v4 landing/portfolio site for software startup
**Stack:** Vue 3 (Composition API), TS, Vite 8, TailwindCSS v4, Vue Router 4, Pinia, vue-i18n v11
**Package manager:** `pnpm` (lockfile: `pnpm-lock.yaml` — do NOT use npm)
**Node:** `^22.18.0 || >=24.12.0`

## Commands

```sh
pnpm dev          # Vite dev server with HMR
pnpm build        # type-check + production build (parallel via npm-run-all2)
pnpm build-only   # vite build without type-check
pnpm type-check   # vue-tsc --build only
pnpm preview      # serve production build
```

No linter/test runner configured. Type-checking is the only gate (`pnpm build` fails on type errors). `tsconfig.app.json` has `noUncheckedIndexedAccess` — array/object index reads are `T | undefined` and must be narrowed.

## Commit Convention

Enforced by husky + commitlint (`@commitlint/config-conventional`) on `commit-msg`. Format:
```
<tipo>: <descripción breve>
```
Types: `feat|fix|docs|style|refactor|perf|test|chore`
Descriptions in Spanish (see `commit.md` for examples).

## Architecture

**Data flow:** `View → Composable → Service → Store`
- Components: only props/emits, no business logic
- `ContactForm` → `useContact()` → `contact.service.ts` (mailto) → store status
- `ScheduleView`, `AppFooter`, `CtaBanner` read links from `useContact()`

**Key directories:**
```
src/
├── components/
│   ├── ui/          # atomic (AppButton, AppCard, WLogo, CtaLink, WhatsAppIcon, SocialIcon)
│   ├── layout/      # AppNavbar, AppFooter, AppSection, SectionHeader
│   └── shared/      # business (ProjectCard, ContactForm, ServiceCard, etc.)
├── composables/     # useLocale, useTheme, useScrollTo, useIntersectionObserver
├── services/        # projects.service (mock + i18n), contact.service (mailto builder)
├── stores/          # locale.store, theme.store, portfolio.store (Pinia setup stores)
├── data/            # static UI content (services, stats, team, pillars, marquee) — keys + icons only
├── types/           # Project, Skill, ContactForm interfaces
├── i18n/locales/    # es.json, en.json (identical key structure, ES fallback)
└── config/contact.ts  # single source of truth for contact/social data
```

Path alias: `@` → `src/`. Barrel exports: `import { AppButton } from '@/components/ui'`

## i18n Rules

- Files: `src/i18n/locales/es.json`, `en.json` — identical structure, ES fallback
- Keys grouped by scope (`nav`, `hero`, `servicios`, `footer`, `projects_data`, …) named in Spanish
- In components: `const { t } = useI18n()` — never hardcode strings
- In services: `i18n.global.t`
- `@` and `{`/`}` are message syntax; literal `@` = `{'@'}`
- Locale persists in localStorage; change only via `locale.store` / `useLocale`
- Page `<title>`/meta in `index.html` are static ES (not localized yet)

## Design System (Tokens in `@theme` block of `src/assets/main.css`)

**Semantic colors (light theme = `:root`, dark = `:root.dark` + media query):**

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--color-abyss` | `#f4f5f8` | `#0e0f12` | Page background |
| `--color-graphite` | `#ffffff` | `#16181d` | Surfaces |
| `--color-carbon` | `#e9ebf0` | `#1e2127` | Elevated surfaces |
| `--color-steel` | `#647084` | `#8b93a1` | Muted accent |
| `--color-silver` | `#454b55` | `#c5c8cf` | Body text |
| `--color-platinum` | `#16181d` | `#e9eaed` | CTA backgrounds / highlights |
| `--color-ink` | `#0e1013` | `#ffffff` | Max-contrast foreground (use instead of white/black) |
| `--color-halo` | `#2b3038` | `#ffffff` | CTA hover |
| `--color-veil` | `#8b93a1` | `#000000` | Shadows |

**Auxiliary vars (no utilities generated):**
- `--metal-1` → `--metal-4`: gradient stops for `.text-metal` (display headings)
- `--logo-glow`: logo glow color

**Fonts:**
- `--font-display`: Bebas Neue (giant uppercase headings)
- `--font-headline`: Fraunces (headlines)
- `--font-body`: Inter (body text)
- `--font-roboto`: Roboto (fallback)

**Theme switching:** Default = OS preference. Manual override via `theme.store` toggles `.light`/`.dark` on `<html>`. No class = system. **No `dark:` variants needed** — colors flip via tokens.

**Never hardcode:** `text-white`, `bg-black`, raw hex, rgba. Use tokens: `text-ink`, `border-ink/10`, `var(--metal-*)`, etc.

**Animations:** Defined as tokens (`animate-fade-up`, `animate-rise`, `animate-drift`, `animate-marquee`, …) with `prefers-reduced-motion` block.

**Route transitions:** `.page-*` classes via `<Transition name="page">` in App.vue.

**Scroll reveal:** `RevealOnScroll` component (`.reveal` / `.is-visible` classes).

**Brand logo:** `WLogo` (inlines `W-logo.svg`, inherits `currentColor`).

**CTA style:** `CtaLink` with `.btn-shine` periodic shimmer.

## Contact / Social (single source: `src/config/contact.ts`)

```ts
CONTACT_EMAIL = 'windkode@gmail.com'
WHATSAPP_NUMBER = '59175904262'  // E.164 without +
SOCIAL_LINKS = [
  { key: 'instagram', href: 'https://www.instagram.com/windkode/' },
  { key: 'facebook',  href: 'https://www.facebook.com/share/1B9j2nfj35/' },
  { key: 'linkedin',  href: 'https://www.linkedin.com/company/windkode/' },
]
```
Override via `VITE_CONTACT_EMAIL` / `VITE_WHATSAPP_NUMBER`.

**Form submission:** No backend. `buildContactMailto()` creates `mailto:` with subject/body, sets `window.location.href`. Spaces encoded as `%20` (not `+`). WhatsApp link built in `useContact()` using `contacto.whatsapp_mensaje` i18n key.

## Deploy

Vercel: `vercel.json` → framework `vite`, build `pnpm build`, output `dist`. No rewrites, no API, no server code.

## Key Files to Know

| File | Purpose |
|------|---------|
| `src/assets/main.css` | All design tokens (colors, fonts, animations) |
| `src/config/contact.ts` | Contact/social data (single source) |
| `src/composables/useContact.ts` | Reactive contact links + form status |
| `src/services/contact.service.ts` | `buildContactMailto()` |
| `src/i18n/locales/es.json` | All user-facing text (ES) |
| `src/stores/locale.store.ts` | Locale persistence + `<html lang>` sync |
| `src/stores/theme.store.ts` | Theme persistence + `<html class>` toggle |
| `vercel.json` | Deploy config |
