import { createMemoryHistory } from 'vue-router'
import { renderToString } from 'vue/server-renderer'
import { createHead, transformHtmlTemplate } from '@unhead/vue/server'
import { createWindApp } from './app'

export { prerenderRoutes } from './router'
export { SITE_URL } from './config/site'

/**
 * Renderiza una ruta a HTML completo a partir de la plantilla de `dist/index.html`.
 * Lo usa scripts/prerender.mjs en el build para generar una página estática por ruta,
 * con su <title>, meta, canonical y JSON-LD ya resueltos (indexable sin JavaScript).
 */
export async function render(url: string, template: string): Promise<string> {
  const { app, router } = createWindApp(createMemoryHistory(), true)
  const head = createHead()
  app.use(head)

  await router.push(url)
  await router.isReady()

  const appHtml = await renderToString(app)
  return transformHtmlTemplate(head, template.replace('<!--app-html-->', appHtml))
}
