import { createI18n } from 'vue-i18n'
import es from './locales/es.json'
import en from './locales/en.json'

export type AppLocale = 'es' | 'en'

/**
 * Siempre arranca en `es`: es el idioma del HTML prerenderizado y la hidratación
 * debe coincidir con él. El idioma guardado se aplica justo después de montar
 * (ver `useLocaleStore().restore()` en main.ts).
 */
export const i18n = createI18n({
  legacy: false,
  locale: 'es',
  fallbackLocale: 'es',
  messages: { es, en },
})

/** Idioma guardado por el visitante, si lo hay (solo navegador). */
export function readSavedLocale(): AppLocale | null {
  try {
    const saved = localStorage.getItem('locale')
    return saved === 'es' || saved === 'en' ? saved : null
  } catch {
    return null
  }
}
