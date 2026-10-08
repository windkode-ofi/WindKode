import './assets/main.css'
import 'lenis/dist/lenis.css'
import { createWebHistory } from 'vue-router'
import { createHead } from '@unhead/vue/client'
import { createWindApp } from './app'
import { useLocaleStore } from './stores/locale.store'
import { useThemeStore } from './stores/theme.store'

const container = document.getElementById('app')
// En build cada ruta llega prerenderizada: se hidrata. En `pnpm dev` el contenedor está vacío.
const hydrate = Boolean(container?.firstElementChild)

const { app, router, pinia } = createWindApp(createWebHistory(), hydrate)
app.use(createHead())

router.isReady().then(() => {
  app.mount('#app')
  // Preferencias del visitante: se aplican después de hidratar para no romper el HTML servido.
  useThemeStore(pinia).restore()
  useLocaleStore(pinia).restore()
  // Avisa a la pantalla de carga (script inline de index.html) de que la app ya está lista.
  requestAnimationFrame(() => window.dispatchEvent(new Event('wk:app-ready')))
})
