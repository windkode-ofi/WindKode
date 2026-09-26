import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/stores/theme.store'

export function useTheme() {
  const store = useThemeStore()
  const { isDark, preference } = storeToRefs(store)
  return { isDark, preference, setTheme: store.setTheme, toggle: store.toggle }
}
