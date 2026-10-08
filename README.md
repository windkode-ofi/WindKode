# WindKode

> **Desarrollamos software a medida y automatizamos procesos con la agilidad del viento.**

Monorepo de WindKode: la landing pública, el panel interno y la API.

## Estructura

```
apps/
├── web/      Landing pública (Vue 3 + Vite + prerender SSG, ES/EN) → ver apps/web/README.md
├── admin/    Panel interno: CRM de clientes, kanban de ventas y equipo (Vue + Nuxt UI)
└── api/      Backend NestJS + Prisma + Postgres (Supabase)
packages/
├── shared/         Contrato único: tipos, schemas zod, constantes y utilidades
└── eslint-config/  Reglas de lint compartidas
docs/         Guías del proyecto (marca, commits)
documentos/   Contratos y propuestas (solo local, fuera de git)
```

## Requisitos

- Node **24** (`.nvmrc`) — `nvm use`
- pnpm **10.33** (fijado en `packageManager`) — `corepack enable`

## Comandos

```sh
pnpm install      # instala todo el monorepo (y los hooks de git)
pnpm db:up        # Postgres local con docker (puerto 5433)
pnpm dev:api      # api en http://localhost:4000
pnpm dev:admin    # panel en http://localhost:5174
pnpm dev:web      # landing en modo desarrollo
pnpm build        # build de todas las apps (Turborepo)
pnpm typecheck    # typecheck de todas las apps
pnpm clean        # borra builds, node_modules y caché de turbo
pnpm fresh        # clean + install
```

## Primer arranque del panel

```sh
cp apps/api/.env.example apps/api/.env      # ajusta JWT_SECRET y la clave del admin
cp apps/admin/.env.example apps/admin/.env
pnpm db:up
pnpm --filter @windkode/api prisma:migrate:dev
pnpm --filter @windkode/api seed            # admin + datos de ejemplo (idempotente)
pnpm dev:api   # en otra terminal: pnpm dev:admin
```

Entra con `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` del `.env` de la api.

## Flujo de trabajo

- `main` = producción, `develop` = preproducción. Nunca se trabaja directo en `main`.
- Ramas de trabajo `<tipo>/<descripcion>` desde `develop`, de vuelta por PR.
- Commits convencionales en español con scope obligatorio: ver [`docs/commit.md`](docs/commit.md).
