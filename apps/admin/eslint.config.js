import { vueConfig } from '@windkode/eslint-config/vue'

// El tsconfig.json raíz solo tiene referencias: el project service no las sigue, así que se apunta a cada tsconfig.
export default [
    ...vueConfig,
    { ignores: ['src/components.d.ts'] },
    {
        files: ['**/*.ts', '**/*.vue'],
        languageOptions: {
            parserOptions: {
                project: ['./tsconfig.vitest.json', './tsconfig.node.json'],
                projectService: false,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
]
