# Convención de commits

Commits convencionales **en español y con scope obligatorio**, validados por commitlint en el hook `commit-msg` (`commitlint.config.cjs`).

## Formato

```
<tipo>(<scope>): <descripción breve en minúscula>

<cuerpo opcional>
```

## Tipos

| Tipo       | Cuándo usarlo                                                    |
|------------|------------------------------------------------------------------|
| `feat`     | Nueva funcionalidad.                                             |
| `fix`      | Corrección de un error.                                          |
| `docs`     | Solo documentación (README, CLAUDE.md, docs/).                   |
| `style`    | Formato (espacios, indentación) sin efecto en el código.         |
| `refactor` | Reestructuración sin corregir errores ni añadir funcionalidad.   |
| `perf`     | Mejora de rendimiento.                                           |
| `test`     | Añadir o corregir tests.                                         |
| `build`    | Sistema de build o dependencias externas.                        |
| `ci`       | Workflows de CI/CD.                                              |
| `chore`    | Mantenimiento que no encaja en lo anterior.                      |
| `revert`   | Revertir un commit anterior.                                     |

## Scopes (cerrados)

| Scope    | Qué abarca                                              |
|----------|---------------------------------------------------------|
| `web`    | `apps/web` (landing)                                    |
| `admin`  | `apps/admin` (panel interno)                            |
| `api`    | `apps/api` (backend NestJS)                             |
| `shared` | `packages/shared`                                       |
| `config` | Configuración de la raíz del monorepo (turbo, pnpm, husky, lint, docs generales) |
| `ci`     | `.github/`                                              |
| `deps`   | Actualización de dependencias                           |

## Ejemplos

```
feat(web): agrega sección de testimonios
fix(web): corrige el carácter @ en los textos de i18n
feat(admin): agrega tablero kanban de ventas
feat(api): agrega módulo de clientes
refactor(shared): extrae los formateadores de moneda
chore(config): configura turborepo
ci(ci): agrega job de typecheck
build(deps): actualiza vue a 3.6
```

## Ramas

- `main`: producción. Nunca se trabaja directo en ella; recibe merges desde `develop`.
- `develop`: preproducción / integración.
- Trabajo: `<tipo>/<descripcion-en-kebab>` (p. ej. `feat/kanban-ventas`), sale de `develop` y vuelve por PR.
