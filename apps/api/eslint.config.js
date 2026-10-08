import { nodeConfig } from '@windkode/eslint-config/node'

// tsconfigRootDir: las rutas del project service se resuelven desde esta app, también al lintear desde la raíz.
export default [
    ...nodeConfig,
    { ignores: ['prisma/migrations/**', 'src/generated/**'] },
    {
        // El seed y prisma.config.ts viven fuera de src: se lintean con el proyecto por defecto.
        files: ['**/*.ts'],
        languageOptions: {
            parserOptions: {
                projectService: { allowDefaultProject: ['*.config.ts', 'prisma/*.ts'] },
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
]
