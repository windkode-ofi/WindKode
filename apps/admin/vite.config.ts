import ui from '@nuxt/ui/vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [
        vue(),
        ui({
            // Los composables se importan explícitamente; los componentes (UButton, UTable...) sí se auto-importan en los templates.
            autoImport: false,
            components: { dts: 'src/components.d.ts' },
            ui: { colors: { neutral: 'zinc', primary: 'jade' } },
        }),
    ],
    resolve: {
        alias: { '~': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    server: { port: 5174, strictPort: true },
})
