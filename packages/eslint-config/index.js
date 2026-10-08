// Base agnóstica de framework: los 7 principios del estándar de lint (el 8, formato, es de Prettier).
// Las excepciones se declaran aquí o en los presets por glob, nunca en línea (noInlineConfig).
import js from '@eslint/js'
import perfectionist from 'eslint-plugin-perfectionist'
import unusedImports from 'eslint-plugin-unused-imports'
import tseslint from 'typescript-eslint'

const UNUSED_VARS_OPTIONS = { args: 'after-used', argsIgnorePattern: '^_', vars: 'all', varsIgnorePattern: '^_' }

export const ignores = {
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/.turbo/**', '**/generated/**'],
}

export const baseConfig = [
    ignores,
    js.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    perfectionist.configs['recommended-alphabetical'],
    {
        languageOptions: {
            parserOptions: { projectService: { allowDefaultProject: ['*.config.ts'] } },
        },
        linterOptions: { noInlineConfig: true, reportUnusedDisableDirectives: 'error' },
        plugins: { 'unused-imports': unusedImports },
        rules: {
            '@typescript-eslint/await-thenable': 'error',
            '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/no-misused-promises': 'error',
            '@typescript-eslint/no-non-null-assertion': 'off',
            '@typescript-eslint/no-unsafe-argument': 'error',
            '@typescript-eslint/no-unsafe-return': 'error',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/prefer-nullish-coalescing': 'error',
            '@typescript-eslint/prefer-optional-chain': 'error',
            'default-case': 'error',
            eqeqeq: ['error', 'always'],
            'no-console': 'error',
            'no-eval': 'error',
            'no-fallthrough': 'error',
            'no-restricted-syntax': [
                'error',
                {
                    message: 'Usa const: nada de reasignación (guard clauses, expresiones, map/reduce).',
                    selector: 'VariableDeclaration[kind="let"]',
                },
            ],
            'no-var': 'error',
            'object-shorthand': ['error', 'always'],
            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': ['warn', UNUSED_VARS_OPTIONS],
        },
    },
    {
        // Archivos JS de configuración: sin información de tipos.
        ...tseslint.configs.disableTypeChecked,
        files: ['**/*.{js,mjs,cjs}'],
    },
]

export default baseConfig
