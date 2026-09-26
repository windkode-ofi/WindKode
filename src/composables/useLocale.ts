import { storeToRefs } from 'pinia'
import { useLocaleStore } from '@/stores/locale.store'

export function useLocale() {
  const store = useLocaleStore()
  const { locale } = storeToRefs(store)
  return { locale, setLocale: store.setLocale, toggle: store.toggle }
}
