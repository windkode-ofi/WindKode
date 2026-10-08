# WindKode

> **Desarrollamos software a medida y automatizamos procesos con la agilidad del viento.**

Monorepo de WindKode: la landing pública, el panel interno y la API.

## Estructura

```
apps/
├── web/      Landing pública (Vue 3 + Vite + prerender SSG, ES/EN) → ver apps/web/README.md
├── admin/    Panel interno: CMS, ventas y kanban (próximamente)
└── api/      Backend NestJS + Prisma + Supabase (próximamente)
packages/
└── shared/   Tipos, schemas zod y utilidades compartidas (próximamente)
docs/         Guías del proyecto (marca, commits)
documentos/   Contratos y propuestas (solo local, fuera de git)
```

## Requisitos

- Node **24** (`.nvmrc`) — `nvm use`
- pnpm **10.33** (fijado en `packageManager`) — `corepack enable`

## Comandos

```sh
pnpm install      # instala todo el monorepo (y los hooks de git)
pnpm dev:web      # landing en modo desarrollo
pnpm build        # build de todas las apps (Turborepo)
pnpm typecheck    # typecheck de todas las apps
pnpm clean        # borra builds, node_modules y caché de turbo
pnpm fresh        # clean + install
```

## Flujo de trabajo

- `main` = producción, `develop` = preproducción. Nunca se trabaja directo en `main`.
- Ramas de trabajo `<tipo>/<descripcion>` desde `develop`, de vuelta por PR.
- Commits convencionales en español con scope obligatorio: ver [`docs/commit.md`](docs/commit.md).
