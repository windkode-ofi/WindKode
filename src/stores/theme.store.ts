import { defineStore } from 'pinia'
import { computed, ref, watchEffect } from 'vue'

export type ThemePreference = 'system' | 'light' | 'dark'

const STORAGE_KEY = 'theme'

export const useThemeStore = defineStore('theme', () => {
  const media = window.matchMedia('(prefers-color-scheme: dark)')

  const saved = localStorage.getItem(STORAGE_KEY)
  const preference = ref<ThemePreference>(
    saved === 'light' || saved === 'dark' ? saved : 'system',
  )
  const systemDark = ref(media.matches)

  media.addEventListener('change', (e) => {
    systemDark.value = e.matches
  })

  const isDark = computed(() =>
    preference.value === 'system' ? systemDark.value : preference.value === 'dark',
  )

  watchEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', preference.value === 'dark')
    root.classList.toggle('light', preference.value === 'light')
    if (preference.value === 'system') {
      localStorage.removeItem(STORAGE_KEY)
    } else {
      localStorage.setItem(STORAGE_KEY, preference.value)
    }
  })

  function setTheme(value: ThemePreference) {
    preference.value = value
  }

  function toggle() {
    preference.value = isDark.value ? 'light' : 'dark'
  }

  return { preference, isDark, setTheme, toggle }
})
