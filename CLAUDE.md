# CLAUDE.md

Guidance for Claude Code (and opencode, via the `AGENTS.md` symlink) at the root of the WindKode monorepo. Each app has its own `CLAUDE.md` with app-specific rules — read it before touching that app.

## Monorepo

pnpm workspaces + Turborepo. Node `>=24.12.0` (`.nvmrc` = 24, same value in every `engines`), pnpm pinned via `packageManager`. Never use npm.

```
apps/web/        landing (Vue 3 + Vite + prerender SSG, bilingual ES/EN) → see apps/web/CLAUDE.md
apps/admin/      internal panel: CMS, sales, kanban (planned — web only, no mobile app)
apps/api/        NestJS + Prisma + Supabase Postgres (planned)
packages/shared/ shared types, zod schemas, constants, utils (planned)
docs/            project guides tracked in git (BRAND-GUIDE.md, commit.md)
documentos/      business documents (contracts, proposals, docx/pdf) — local only, gitignored
```

## Commands (from the root)

```sh
pnpm install
pnpm dev:web      # landing dev server
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

## Visual design

The landing's look is fixed and must be preserved: any refactor of `apps/web` has to produce the same rendered output (compare the prerendered `dist/*.html` and check the pages visually).
