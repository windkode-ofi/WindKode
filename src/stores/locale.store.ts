import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { i18n } from '@/i18n'

export const useLocaleStore = defineStore('locale', () => {
  const locale = ref(i18n.global.locale.value)

  watch(locale, (val) => {
    i18n.global.locale.value = val
    document.documentElement.lang = val
    localStorage.setItem('locale', val)
  })

  function setLocale(lang: 'es' | 'en') {
    locale.value = lang
  }

  function toggle() {
    setLocale(locale.value === 'es' ? 'en' : 'es')
  }

  return { locale, setLocale, toggle }
})
