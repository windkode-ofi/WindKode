import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

export type ThemePreference = 'system' | 'light' | 'dark'

const STORAGE_KEY = 'theme'

/**
 * La clase `.light`/`.dark` de <html> la pone un script inline de index.html
 * antes del primer pintado (sin parpadeo). Este store arranca en «sistema» para
 * que la hidratación coincida con el HTML prerenderizado y lee la preferencia
 * real en `restore()`, justo después de montar.
 */
export const useThemeStore = defineStore('theme', () => {
  const preference = ref<ThemePreference>('system')
  const systemDark = ref(false)

  const isDark = computed(() =>
    preference.value === 'system' ? systemDark.value : preference.value === 'dark',
  )

  watch(preference, (value) => {
    const root = document.documentElement
    root.classList.toggle('dark', value === 'dark')
    root.classList.toggle('light', value === 'light')
    if (value === 'system') localStorage.removeItem(STORAGE_KEY)
    else localStorage.setItem(STORAGE_KEY, value)
  })

  function restore() {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    systemDark.value = media.matches
    media.addEventListener('change', (e) => {
      systemDark.value = e.matches
    })
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') preference.value = saved
  }

  function setTheme(value: ThemePreference) {
    preference.value = value
  }

  function toggle() {
    preference.value = isDark.value ? 'light' : 'dark'
  }

  return { preference, isDark, setTheme, toggle, restore }
})
