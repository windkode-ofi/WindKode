# CLAUDE.md

Guidance for Claude Code (and opencode, via the `AGENTS.md` symlink) at the root of the WindKode monorepo. Each app has its own `CLAUDE.md` with app-specific rules — read it before touching that app.

## Monorepo

pnpm workspaces + Turborepo. Node `>=24.12.0` (`.nvmrc` = 24, same value in every `engines`), pnpm pinned via `packageManager`. Never use npm.

```
apps/web/        landing (Vue 3 + Vite + prerender SSG, bilingual ES/EN) → see apps/web/CLAUDE.md
apps/admin/      internal panel: CRM, sales kanban, team (Vue + Nuxt UI, web only — no mobile app) → see apps/admin/CLAUDE.md
apps/api/        NestJS 12 + Prisma 7 + Postgres (Supabase) → see apps/api/CLAUDE.md
packages/shared/ single contract: types, zod schemas, _LABEL/_COLOR constants, pure utils (ESM, tsc build, vitest)
packages/eslint-config/ base + vue + node presets (alphabetical order, no let, no any, noInlineConfig)
docs/            project guides tracked in git (BRAND-GUIDE.md, commit.md)
documentos/      business documents (contracts, proposals, docx/pdf) — local only, gitignored
```

## Commands (from the root)

```sh
pnpm install
pnpm dev          # everything at once: db + api :4000 + admin :5174 + web :5173 + shared watch
pnpm db:up        # local Postgres (docker compose, :5433)
pnpm dev:api      # api on :4000 (+ shared in watch mode)
pnpm dev:admin    # admin on :5174
pnpm dev:web      # landing dev server
pnpm lint | test  # turbo run lint / test
pnpm check        # lint + typecheck + prettier --check
pnpm build        # turbo run build (every app; ^build builds packages first)
pnpm typecheck    # turbo run typecheck
pnpm clean        # remove build outputs, node_modules and .turbo
pnpm fresh        # clean + install
pnpm --filter @windkode/web <script>   # run a script in one workspace
```

`turbo.json` declares `VITE_*` in the build task `env`: Turborepo filters undeclared env vars, so any new build-time variable must be listed there.

## Git

- `main` is production — **never commit to it directly**. Work happens on `develop` (pre-production) or on `<tipo>/<descripcion>` branches cut from `develop`, merged back by PR; `develop` is merged into `main` once verified.
- Conventional commits **in Spanish with a mandatory scope**, enforced by commitlint (`commitlint.config.cjs`): scopes `web | admin | api | shared | config | ci | deps`. Examples in `docs/commit.md`.
- husky lives at the root (`prepare` script); hooks in `.husky/`.

## Standards

The developer's standards live in the Obsidian vault (`~/Obsidian Vault/Desarollo/Mis estándares/`, derived from the Q-minex monorepo): code in English, user-facing text in Spanish (tuteo), string-literal unions instead of `enum`, no `any`, `import type`, one zod contract per request in `packages/shared`, layer-prefixed components (`UI*`, `Common*`, `Form*`, `Layout*`) for new apps. Documented exceptions: `apps/web` keeps vue-i18n (the product is bilingual) and commits are in Spanish.

## Formatting

Prettier: 4 spaces, 120 columns, no semicolons, single quotes, one attribute per line. Applied by lint-staged on `pre-commit` (ESLint `--fix` + Prettier). `apps/web` is excluded in `.prettierignore` until its dedicated formatting pass (the CSS-order plugin could change the rendered output).

## Visual design

The landing's look is fixed and must be preserved: any refactor of `apps/web` has to produce the same rendered output (compare the prerendered `dist/*.html` and check the pages visually).
