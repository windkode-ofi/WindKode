import type { UserRole } from '@windkode/shared'

import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '~/shared/stores/authStore'

declare module 'vue-router' {
    interface RouteMeta {
        /** Ruta abierta (login). Sin esto, la ruta exige sesión. */
        isPublic?: boolean
        /** Roles permitidos; sin definir = cualquier usuario con sesión. */
        roles?: UserRole[]
        title?: string
    }
}

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            component: () => import('~/features/auth/screens/LoginScreen.vue'),
            meta: { isPublic: true, title: 'Iniciar sesión' },
            name: 'login',
            path: '/login',
        },
        {
            children: [
                {
                    component: () => import('~/features/dashboard/screens/DashboardScreen.vue'),
                    meta: { title: 'Inicio' },
                    name: 'dashboard',
                    path: '',
                },
                {
                    component: () => import('~/features/clients/screens/ClientsScreen.vue'),
                    meta: { title: 'Clientes' },
                    name: 'clients',
                    path: 'clientes',
                },
                {
                    component: () => import('~/features/clients/screens/ClientDetailScreen.vue'),
                    meta: { title: 'Cliente' },
                    name: 'client-detail',
                    path: 'clientes/:id',
                    props: true,
                },
                {
                    component: () => import('~/features/deals/screens/DealsBoardScreen.vue'),
                    meta: { title: 'Ventas' },
                    name: 'deals',
                    path: 'ventas',
                },
                {
                    component: () => import('~/features/users/screens/UsersScreen.vue'),
                    meta: { roles: ['ADMIN'], title: 'Equipo' },
                    name: 'users',
                    path: 'equipo',
                },
            ],
            component: () => import('~/shared/components/layout/LayoutDashboard.vue'),
            path: '/',
        },
        { path: '/:pathMatch(.*)*', redirect: '/' },
    ],
})

// Rutas protegidas centralizadas: la sesión se recupera una vez (cookie de refresh) antes de decidir.
router.beforeEach(async (to) => {
    const auth = useAuthStore()

    if (!auth.isRestored) await auth.restore()

    if (to.meta.isPublic) return auth.isAuthenticated && to.name === 'login' ? { name: 'dashboard' } : true

    if (!auth.isAuthenticated) return { name: 'login', query: to.fullPath === '/' ? {} : { redirect: to.fullPath } }

    if (to.meta.roles && auth.user && !to.meta.roles.includes(auth.user.role)) return { name: 'dashboard' }

    return true
})

router.afterEach((to) => {
    document.title = to.meta.title ? `${to.meta.title} · WindKode` : 'WindKode · Panel interno'
})
