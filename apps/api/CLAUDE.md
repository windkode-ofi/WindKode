# CLAUDE.md — apps/api

NestJS 12 (ESM) + Prisma 7 (`prisma-client` generator, `@prisma/adapter-pg`) over Postgres (Supabase in the cloud, docker compose locally). Monorepo rules live in the root `CLAUDE.md`.

## Commands

```sh
pnpm db:up                         # (root) local Postgres on :5433
pnpm --filter @windkode/api dev    # prisma generate + nest start --watch (port 4000)
pnpm prisma:migrate:dev --name x   # new migration (uses DIRECT_URL)
pnpm seed                          # idempotent seed; refuses to run with APP_ENV=production
pnpm test | lint | typecheck
```

Copy `.env.example` to `.env`. `src/load-env.ts` loads it (first import in `main.ts`); env vars are read once as typed `ENV_*` constants in `src/shared/constants/env.constant.ts`, which throw a clear Spanish message at boot if missing — never read `process.env` elsewhere.

## Architecture

- `src/modules/<feature>/`: flat `module`, `controller`, `service`, `mapper`, `types`. Thin controller → service → Prisma; no repositories.
- Validation at the edge, **per parameter**: `@Body(new ZodValidationPipe(schema))` with schemas from `@windkode/shared`. Never `@UsePipes`, never a loose `schema.parse`.
- Services: guard clauses throwing Nest exceptions with Spanish messages, explicit return types, `findXOrThrow` lookups, `Promise.all` for parallel reads, `$transaction` for multi-writes with `AuditService.record(tx, …)` **inside** the transaction.
- Mappers turn Prisma records into the shared response types (ISO dates, `Decimal` → 2-decimal string). Prisma enums mirror the shared unions — change both together.
- Errors reach clients only through `ApiExceptionFilter` as `ApiError { message (Spanish), statusCode, fieldErrors? }`. Logs are in English via `new Logger(Class.name)`.
- Auth: 15-min HS256 access JWT (Bearer) + rotating opaque refresh token in an httpOnly cookie (`wk_refresh`, path `/auth`, only its sha256 is stored in `sessions`; reuse of a revoked token revokes all the user's sessions). Guards always `@UseGuards(AuthGuard, RoleGuard)` with `@Roles([...])`.
- Prisma schema is split per domain in `prisma/schema/*.prisma`; the generated client goes to `src/generated/prisma` (gitignored). `DATABASE_URL` = runtime (Supabase pooler, port 6543), `DIRECT_URL` = migrations/seed.
- Business rules: the first real interaction (not a NOTE) moves a client from NEW to CONTACTED; kanban moves renumber the affected columns in one transaction (`insertAtPosition` from shared); only the owner or an ADMIN deletes a deal; clients with deals cannot be deleted.
