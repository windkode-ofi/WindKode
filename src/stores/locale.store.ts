import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { i18n, readSavedLocale, type AppLocale } from '@/i18n'

export const useLocaleStore = defineStore('locale', () => {
  const locale = ref<AppLocale>(i18n.global.locale.value as AppLocale)

  watch(locale, (val) => {
    i18n.global.locale.value = val
    document.documentElement.lang = val
    localStorage.setItem('locale', val)
  })

  function setLocale(lang: AppLocale) {
    locale.value = lang
  }

  function toggle() {
    setLocale(locale.value === 'es' ? 'en' : 'es')
  }

  /** Aplica el idioma guardado tras la hidratación (el HTML prerenderizado va en `es`). */
  function restore() {
    const saved = readSavedLocale()
    if (saved) setLocale(saved)
  }

  return { locale, setLocale, toggle, restore }
})
