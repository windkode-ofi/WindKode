// Commits convencionales en español con scope obligatorio: `tipo(scope): descripción`.
// Los scopes son cerrados: uno por app o paquete del monorepo + config, ci y deps.
module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'scope-empty': [2, 'never'],
        'scope-enum': [2, 'always', ['admin', 'api', 'ci', 'config', 'deps', 'shared', 'web']],
    },
}
