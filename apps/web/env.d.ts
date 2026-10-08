/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONTACT_EMAIL?: string
  readonly VITE_WHATSAPP_NUMBER?: string
  /** URL base del sitio para SEO (canonical, OG, sitemap). */
  readonly VITE_SITE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
