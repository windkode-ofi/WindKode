/**
 * Configuración global del sitio para SEO (canonical, Open Graph, JSON-LD).
 * La URL base se puede sobreescribir con VITE_SITE_URL (ej. dominio propio).
 */
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://wind-kode.vercel.app').replace(/\/+$/, '')

export const SITE_NAME = 'WindKode'

/** Organización GitHub usada en JSON-LD (sameAs). */
export const GITHUB_ORG = 'https://github.com/windkode-ofi'

/** Imagen compartible (Open Graph / Twitter), 1200×630. */
export const OG_IMAGE = `${SITE_URL}/og-cover.png`

/** Construye una URL canónica absoluta a partir de una ruta. */
export function absoluteUrl(path: string): string {
  if (!path || path === '/') return `${SITE_URL}/`
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}
