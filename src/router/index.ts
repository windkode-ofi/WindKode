import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/servicios',
      name: 'services',
      component: () => import('@/views/ServicesView.vue'),
    },
    {
      path: '/nosotros',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
    },
    {
      path: '/equipo',
      name: 'team',
      component: () => import('@/views/TeamView.vue'),
    },
    // Módulo de proyectos deshabilitado de momento. Para reactivarlo: restaurar esta
    // ruta, el redirect de `/projects`, el enlace en AppNavbar/AppFooter y el CTA del hero.
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
    },
    { path: '/projects', redirect: '/' },
    { path: '/contact', redirect: '/agenda' },
  ],
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0 }
  },
})

export default router
