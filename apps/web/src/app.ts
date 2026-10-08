import { createApp, createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import type { RouterHistory } from 'vue-router'
import App from './App.vue'
import { createAppRouter } from './router'
import { i18n } from './i18n'

/**
 * Crea la app con sus plugins. Lo comparten el cliente (main.ts) y el prerender
 * (entry-server.ts); cada uno aporta su historial y su instancia de head.
 * `hydrate` usa createSSRApp para reaprovechar el HTML prerenderizado.
 */
export function createWindApp(history: RouterHistory, hydrate: boolean) {
  const app = hydrate ? createSSRApp(App) : createApp(App)
  const pinia = createPinia()
  const router = createAppRouter(history)

  app.use(pinia)
  app.use(router)
  app.use(i18n)

  return { app, router, pinia }
}
