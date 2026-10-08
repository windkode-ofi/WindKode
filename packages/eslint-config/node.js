// Preset para NestJS / Node: promesas estrictas y excepciones de orden donde el orden significa algo.
import globals from 'globals'

import { baseConfig } from './index.js'

export const nodeConfig = [
    ...baseConfig,
    {
        languageOptions: { globals: globals.node },
    },
    {
        // El orden de los handlers decide qué ruta hace match (/me antes que /:id).
        files: ['**/*.controller.ts'],
        rules: { 'perfectionist/sort-classes': 'off' },
    },
    {
        // Los módulos de Nest se leen mejor en orden de dependencia (imports → controllers → providers).
        files: ['**/*.module.ts'],
        rules: { 'perfectionist/sort-objects': 'off' },
    },
]

export default nodeConfig
