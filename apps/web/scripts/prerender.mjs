/**
 * Prerender estático (SSG) tras `vite build` + `vite build --ssr`:
 *   - una página HTML por ruta pública (dist/servicios.html, …) con contenido,
 *     <title>, meta, canonical y JSON-LD ya resueltos → indexable sin JavaScript;
 *   - dist/404.html (Vercel lo sirve con estado 404 para rutas desconocidas);
 *   - dist/sitemap.xml y dist/robots.txt con la URL real del sitio (VITE_SITE_URL).
 * La app se hidrata sobre ese HTML en el navegador (main.ts).
 */
import { readFile, writeFile, rm } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const ssrDir = path.join(root, 'dist-ssr')

const { render, prerenderRoutes, SITE_URL } = await import(path.join(ssrDir, 'entry-server.js'))
const template = await readFile(path.join(dist, 'index.html'), 'utf8')

/** `/` → index.html, `/servicios` → servicios.html (vercel.json usa cleanUrls). */
const fileFor = (route) => (route === '/' ? 'index.html' : `${route.slice(1)}.html`)

for (const { path: route } of prerenderRoutes) {
  await writeFile(path.join(dist, fileFor(route)), await render(route, template))
  console.log(`  prerender  ${route}`)
}

await writeFile(path.join(dist, '404.html'), await render('/404', template))
console.log('  prerender  /404')

const today = new Date().toISOString().slice(0, 10)
const urls = prerenderRoutes
  .map(
    ({ path: route, priority, changefreq }) => `  <url>
    <loc>${SITE_URL}${route === '/' ? '/' : route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
  )
  .join('\n')

await writeFile(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`,
)

await writeFile(
  path.join(dist, 'robots.txt'),
  `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`,
)
console.log('  sitemap.xml + robots.txt')

await rm(ssrDir, { recursive: true, force: true })
