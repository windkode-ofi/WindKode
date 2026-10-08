import { createRouter, type RouteRecordRaw, type RouterHistory } from 'vue-router'
import { scrollToTarget } from '@/composables/useSmoothScroll'

declare module 'vue-router' {
  interface RouteMeta {
    /** Clave i18n del <title> de la página. */
    titleKey?: string
    /** Clave i18n de la meta description de la página. */
    descKey?: string
    /** Clave i18n del último nivel de la migas de pan (JSON-LD). */
    crumbKey?: string
    /** Página fuera del índice de buscadores (404). */
    noindex?: boolean
  }
}

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      titleKey: 'seo.home.titulo',
      descKey: 'seo.home.descripcion',
    },
  },
  {
    path: '/servicios',
    name: 'services',
    component: () => import('@/views/ServicesView.vue'),
    meta: {
      titleKey: 'seo.servicios.titulo',
      descKey: 'seo.servicios.descripcion',
      crumbKey: 'nav.servicios',
    },
  },
  {
    path: '/nosotros',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
    meta: {
      titleKey: 'seo.nosotros.titulo',
      descKey: 'seo.nosotros.descripcion',
      crumbKey: 'nav.nosotros',
    },
  },
  {
    path: '/equipo',
    name: 'team',
    component: () => import('@/views/TeamView.vue'),
    meta: {
      titleKey: 'seo.equipo.titulo',
      descKey: 'seo.equipo.descripcion',
      crumbKey: 'nav.equipo',
    },
  },
  // Módulo de proyectos deshabilitado de momento. Para reactivarlo: restaurar esta
  // ruta, el redirect de `/projects`, el enlace en AppNavbar/AppFooter y el CTA del hero
  // (y quitar las redirecciones equivalentes de vercel.json).
  // {
  //   path: '/proyectos',
  //   name: 'projects',
  //   component: () => import('@/views/ProjectsView.vue'),
  // },
  { path: '/proyectos', redirect: '/' },
  {
    path: '/agenda',
    name: 'schedule',
    component: () => import('@/views/ScheduleView.vue'),
    meta: {
      titleKey: 'seo.agenda.titulo',
      descKey: 'seo.agenda.descripcion',
      crumbKey: 'nav.contacto',
    },
  },
  { path: '/projects', redirect: '/' },
  { path: '/contact', redirect: '/agenda' },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: {
      titleKey: 'seo.no_encontrado.titulo',
      descKey: 'seo.no_encontrado.descripcion',
      noindex: true,
    },
  },
]

/**
 * Rutas que se prerenderizan a HTML estático en el build (ver scripts/prerender.mjs)
 * y que se publican en el sitemap, con su prioridad.
 */
export const prerenderRoutes = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/servicios', priority: '0.9', changefreq: 'monthly' },
  { path: '/agenda', priority: '0.8', changefreq: 'monthly' },
  { path: '/nosotros', priority: '0.7', changefreq: 'monthly' },
  { path: '/equipo', priority: '0.6', changefreq: 'monthly' },
] as const

/** Crea el router: historial web en el navegador, en memoria durante el prerender. */
export function createAppRouter(history: RouterHistory) {
  return createRouter({
    history,
    routes,
    async scrollBehavior(to, from) {
      if (to.hash) {
        // Al cambiar de página el ancla aún no existe: espera a la transición de salida.
        if (to.path !== from.path) await new Promise((resolve) => setTimeout(resolve, 450))
        // Con Lenis activo el desplazamiento lo hace él (suave y con offset de la navbar).
        if (scrollToTarget(to.hash)) return false
        return { el: to.hash, behavior: 'smooth', top: 88 }
      }
      if (to.path === from.path) return false
      scrollToTarget(0, { immediate: true })
      return { top: 0 }
    },
  })
}
