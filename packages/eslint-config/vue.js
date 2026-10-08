// Preset para Vue 3 (<script setup lang="ts">): reglas de template y promesas relajadas en la UI.
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import tseslint from 'typescript-eslint'

import { baseConfig } from './index.js'

export const vueConfig = [
    ...baseConfig,
    ...pluginVue.configs['flat/recommended'],
    {
        files: ['**/*.vue'],
        languageOptions: {
            parserOptions: { extraFileExtensions: ['.vue'], parser: tseslint.parser, projectService: true },
        },
    },
    {
        languageOptions: { globals: globals.browser },
        rules: {
            // Los handlers async en eventos son idiomáticos en la UI.
            '@typescript-eslint/no-floating-promises': 'off',
            '@typescript-eslint/no-misused-promises': 'off',
            'vue/attribute-hyphenation': ['error', 'never'],
            'vue/attributes-order': ['error', { alphabetical: true }],
            'vue/custom-event-name-casing': ['error', 'camelCase'],
            'vue/define-emits-declaration': ['error', 'type-based'],
            'vue/html-self-closing': ['error', { html: { component: 'always', normal: 'always', void: 'always' } }],
            // El prefijo de capa (UI*, Common*, Layout*...) ya da nombres compuestos.
            'vue/multi-word-component-names': 'off',
            'vue/prop-name-casing': ['error', 'camelCase'],
            'vue/require-v-for-key': 'error',
            'vue/v-on-event-hyphenation': ['error', 'never', { autofix: true }],
        },
    },
    {
        // typescript-eslint no ve los tipos de los SFC (.vue): eso lo resuelve vue-tsc, que corre en `typecheck` y en el build.
        // Sin esta excepción, cada ref de plantilla o componente importado da falsos positivos de no-unsafe-*.
        files: ['**/*.vue', '**/main.ts'],
        rules: {
            '@typescript-eslint/no-unsafe-argument': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-return': 'off',
        },
    },
    {
        // Los stores se leen como estado → acciones.
        files: ['**/stores/**'],
        rules: { 'perfectionist/sort-objects': 'off' },
    },
]

export default vueConfig
