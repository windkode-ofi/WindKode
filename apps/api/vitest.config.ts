import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'

// SWC compila los decoradores de Nest con su metadata (esbuild no emite emitDecoratorMetadata).
export default defineConfig({
    plugins: [swc.vite({ module: { type: 'es6' } })],
    test: { environment: 'node', include: ['src/**/*.test.ts'], setupFiles: ['src/test.setup.ts'] },
})
