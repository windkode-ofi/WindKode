import { nodeConfig } from '@windkode/eslint-config/node'

// tsconfigRootDir: las rutas del project service se resuelven desde este paquete, también al lintear desde la raíz.
export default [...nodeConfig, { languageOptions: { parserOptions: { tsconfigRootDir: import.meta.dirname } } }]
