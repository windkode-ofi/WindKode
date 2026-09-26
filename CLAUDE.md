# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

WindKode — landing/portfolio site for a software development startup. Mission: custom software and process automation "with the agility of the wind" (lightweight, fast, accessible apps). Primary language of content and commits is Spanish; the UI is bilingual (ES default / EN) via vue-i18n.

## Commands

Uses pnpm (`pnpm-lock.yaml` is the canonical lockfile; a stale `package-lock.json` also exists — don't use npm). Node `^22.18.0 || >=24.12.0` (see `engines`).

```sh
pnpm dev          # Vite dev server with HMR
pnpm build        # type-check + production build (runs both in parallel via npm-run-all2)
pnpm build-only   # vite build without type-check
pnpm type-check   # vue-tsc --build only
pnpm preview      # serve the production build
```

There is no linter or test runner configured. Type-checking is the only gate: `pnpm build` fails on type errors. `tsconfig.app.json` enables `noUncheckedIndexedAccess`, so array/object index reads are `T | undefined` and must be narrowed. `pnpm install` runs `husky` via the `prepare` script, which installs the `commit-msg` hook.

## Commit convention

Enforced by husky + commitlint (`@commitlint/config-conventional`) on `commit-msg`. Format: `<tipo>: <descripción breve>` with types `feat|fix|docs|style|refactor|perf|test|chore`. Descriptions are written in Spanish (see `commit.md` for examples).

## Deploy

Vercel, configured in `vercel.json` (framework `vite`, `pnpm build`, output `dist`). No rewrites are declared there. There is no `api/` directory and no server-side code.

## Contact channels

All contact data lives in `src/config/contact.ts` (email `windkode@gmail.com`, WhatsApp `5917590262` in E.164 without `+`), overridable via `VITE_CONTACT_EMAIL` / `VITE_WHATSAPP_NUMBER`, plus `SOCIAL_LINKS` (Instagram, Facebook, LinkedIn; keep URLs free of tracking params). Consume it only through `useContact()` (`src/composables/useContact.ts`), which builds the localized `wa.me` link (default message = `contacto.whatsapp_mensaje`), the `mailto:` link, and drives the form status (`idle | sent`).

There is **no backend**: submitting the form calls `buildContactMailto` (`contact.service.ts`) and sets `window.location.href` to a `mailto:` URL with subject and body prefilled, so the visitor's own mail client sends the message. Spaces are encoded as `%20` (not `+`) because mail clients don't decode `+` in `mailto:`.

`CtaLink` accepts either `to` (RouterLink) or `href` (external `<a>` with `target=_blank`). Brand glyphs are hand-drawn ui components since lucide ships no brand icons: `WhatsAppIcon` and `SocialIcon` (`name` = `instagram | facebook | linkedin`). The social icon row is the shared `SocialLinks` component (props `size`, `label`), rendered in the hero under the CTAs, the footer bottom bar, and `/agenda` — add networks in `SOCIAL_LINKS` only.

## Stack

Vue 3 (Composition API, `<script setup lang="ts">`), TypeScript, Vite 8, TailwindCSS v4 (via `@tailwindcss/vite`, no tailwind.config — theme lives in `src/assets/main.css` `@theme` block), Vue Router 4, Pinia (setup-store style), vue-i18n v11 (Composition API, `legacy: false`).

## Architecture

Intended data flow: **View → Composable → Service → Store**. Components receive props and emit events only — no business logic in components. `ContactForm` goes through `useContact()`; `ScheduleView`, `AppFooter` and `CtaBanner` read the contact links from the same composable.

- `src/components/ui/` — atomic base components (AppButton, AppCard, AppBadge, WLogo, CtaLink), styled with Tailwind, variant props
- `src/components/layout/` — AppNavbar, AppFooter, AppSection, SectionHeader (page chrome; navbar/footer mounted once in App.vue)
- `src/components/shared/` — business components (ProjectCard, ContactForm, ServiceCard, TeamCard, StatsBar, TechMarquee, CtaBanner, RevealOnScroll, …)
- `src/composables/` — thin reactive wrappers (useLocale / useTheme wrap their stores, useScrollTo, useIntersectionObserver)
- `src/services/` — data layer returning Promises. `projects.service` is mock data resolved through i18n so it localizes; `contact.service` only builds the `mailto:` URL (see Contact channels).
- `src/data/` — static UI content (services, stats, team, pillars, marquee items) with lucide icon components; user-facing text stays in i18n, these arrays hold only keys + icons
- `src/stores/` — Pinia setup stores: `locale.store` (single writer for locale: syncs vue-i18n, `<html lang>`, localStorage), `theme.store`, `portfolio.store` (projects via service)
- `src/types/` — shared interfaces (Project, Skill, ContactForm)

Each component folder has an `index.ts` barrel — import via `import { AppButton } from '@/components/ui'`. Path alias `@` → `src/`.

## i18n rules

- Translation files: `src/i18n/locales/es.json` and `en.json`. Both files must always have identical key structure; `es` is the fallback locale.
- Keys are grouped by scope (`nav`, `hero`, `servicios`, `footer`, …) and named in Spanish.
- In components use `const { t } = useI18n()` — never hardcode user-facing strings. Outside components (services) use `i18n.global.t`.
- vue-i18n treats `@` and `{`/`}` as message syntax; a literal `@` in a translation must be written as `{'@'}`.
- Mock/data text (e.g. projects) also goes through i18n (`projects_data.*`).
- Locale persists in localStorage; change it only through the locale store / useLocale. Initial locale is read from localStorage in `src/i18n/index.ts` before the app mounts.
- The page `<title>` and meta description in `index.html` are static Spanish — they are not localized (the `meta` i18n keys exist but nothing reads them yet).

## Design system

The palette is **semantic and theme-aware**, defined once in the `@theme` block of `src/assets/main.css`: abyss (page background), graphite (surfaces), carbon (elevated surfaces), steel (muted accent), silver (body text), platinum (CTA background), ink (max-contrast foreground — use it instead of `white`/`black` utilities), halo (CTA hover), veil (shadow color), jade y jade-soft (**el acento de marca, el verde `#06d6a0` del «KODE» del logo — solo existe en tema OSCURO**; en claro cada uno cae en el neutro que la paleta usaba antes del acento, así que el tema claro se ve sin verde: `jade` = ink para primer plano —texto, iconos, hover, foco, activo— y `jade-soft` = steel para bordes y marcas —«KODE», glifos, separadores—). Es el **único acento cromático** y solo en oscuro: el logotipo, el satélite del hero, los separadores del marquee y, sobre todo, **estados** — hover de tarjetas, iconos, enlaces y CTA outline, foco de formulario, nodo activo de la órbita, enlace activo de la navbar. En reposo casi no se ve; aparece al interactuar. `--jade-glow` sigue la misma regla (verde en oscuro, neutro en claro). No se usa en superficies, texto corrido, títulos ni en el CTA sólido. Light values live on `:root`; dark values are redefined under `:root.dark` and duplicated inside a `prefers-color-scheme: dark` media block for the system default — **keep those two dark blocks in sync**. Theme selection: default follows the OS; `theme.store.ts` persists a manual `light`/`dark` override in localStorage by toggling a `.light`/`.dark` class on `<html>` (no class = system). No `dark:` variants are needed — colors flip via the tokens, so never hardcode `text-white`, `bg-black`, raw hex, or rgba in components (use `text-ink`, `border-ink/10`, the `--metal-*`/`--logo-glow` vars, etc.). Font tokens: Bebas Neue = display for giant uppercase headings, Fraunces = headline, Inter = body (Roboto is also loaded as `--font-roboto`).

Animations are also tokens in `@theme` (`animate-fade-up`, `animate-rise`, `animate-drift`, `animate-float-*`, `animate-marquee`, …) with a `prefers-reduced-motion` block at the bottom of `main.css`. Route transitions use the `.page-*` classes there via `<Transition name="page">` in App.vue.

When consuming Pinia stores outside components, and in composables, use `storeToRefs` to keep reactivity (see `useLocale`/`useTheme`). Dark, minimalist aesthetic; big display titles use the `.text-metal` gradient class, primary CTAs use `CtaLink` (which carries the `.btn-shine` periodic shimmer). Icons come from `@lucide/vue`. Scroll-reveal animations use the `RevealOnScroll` shared component (`.reveal` / `.is-visible` classes). Brand logo: `src/assets/svg/W-logo.svg` (inlined as the `WLogo` ui component so it inherits `currentColor`). Pieza gráfica de marca para redes: `src/assets/svg/poster-marca.svg` (1080×1350, vectorial y autocontenido — lleva Bebas Neue e Inter subconjuntadas e incrustadas en base64, usa los tokens del tema oscuro y su texto sale de los mismos strings de i18n) y su export `src/assets/poster-marca.png`.

## Routes

Each nav section is its own lazy-loaded page: `/` (hero + teasers), `/servicios`, `/nosotros`, `/equipo`, `/agenda` (contact form). Legacy `/contact` redirects to `/agenda`. The projects module (`ProjectsView`, `ProjectCard`, `portfolio.store`, `projects.service`, `projects_data.*` i18n) is **disabled for now**: its route is commented out in `src/router/index.ts` and `/proyectos` / `/projects` redirect to `/`; it is not linked from the navbar, footer or hero. Keep its files intact so it can be re-enabled. `scrollBehavior` scrolls smoothly to a hash if present, otherwise to top. The navbar logo links home ("Inicio" is the logo, not a nav item); the navbar morphs into a floating island pill on scroll.
