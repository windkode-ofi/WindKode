# CLAUDE.md — apps/admin

Internal panel (web only — there is no mobile app): CRM, sales kanban and team management. Vue 3 + Vite + Nuxt UI 4 (Vue mode) + Pinia + vue-router. Spanish only, no i18n. Monorepo rules live in the root `CLAUDE.md`.

## Commands

```sh
pnpm dev:admin    # (root) vite on :5174 + shared in watch mode; needs the api on :4000
pnpm --filter @windkode/admin typecheck | lint | test | build
```

`VITE_API_URL` points to the api (default `http://localhost:4000`); the api's `CORS_ORIGINS` must include this app's origin.

## Architecture

- `src/features/<feature>/{screens,components,services,composables}` + `src/shared/{components/{layout,common},composables,services,stores,utils}`. Relative imports inside a feature, `~/` across features.
- Data flow: screen → service (returns `GenericResponse<T>`, never throws) → `httpClient` (`src/shared/services/httpClient.ts`, the only place that calls `fetch`: Bearer, `credentials: 'include'`, one shared refresh on 401 then a single retry; session expiry redirects to `/login?expirada=1`).
- Session: `useAuthStore` keeps the access token in memory only; on boot the router calls `restore()` (refresh cookie). Route `meta`: `isPublic`, `roles`, `title`.
- Forms are dumb: `UForm` with the shared zod schema, emit `submit(data)`, expose `setFieldErrors` so the container maps API `fieldErrors` back to fields. Containers (`*Slideover`, `*Modal`, screens) call the service and toast.
- User feedback only through `useAppToast()`. Status badges use the shared `_LABEL`/`_COLOR` maps via `CommonStatusBadge`.
- Components are auto-imported by Nuxt UI (`src/components.d.ts`, committed); composables are imported explicitly (`@nuxt/ui/composables`). Brand accent: Nuxt UI `primary` = `jade` palette (`#06d6a0`) defined in `src/assets/main.css`.
- Kanban: `useDealsBoard` moves cards optimistically with the same `insertAtPosition` as the api and rolls back on error; native HTML5 drag & drop in `DealsBoardColumn`.
