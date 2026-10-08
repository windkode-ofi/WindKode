<script setup lang="ts">
    import type { NavigationMenuItem } from '@nuxt/ui'

    import { USER_ROLE_LABEL } from '@windkode/shared'
    import { computed } from 'vue'
    import { useRouter } from 'vue-router'

    import { useAuthStore } from '~/shared/stores/authStore'

    const auth = useAuthStore()
    const router = useRouter()

    const navigation = computed<NavigationMenuItem[]>(() => [
        { icon: 'i-lucide-layout-dashboard', label: 'Inicio', to: '/' },
        { icon: 'i-lucide-contact', label: 'Clientes', to: '/clientes' },
        { icon: 'i-lucide-kanban', label: 'Ventas', to: '/ventas' },
        ...(auth.isAdmin ? [{ icon: 'i-lucide-users', label: 'Equipo', to: '/equipo' }] : []),
    ])

    const handleLogout = async () => {
        await auth.logout()
        await router.push({ name: 'login' })
    }
</script>

<template>
    <UDashboardGroup>
        <UDashboardSidebar
            collapsible
            :ui="{ footer: 'border-t border-default' }"
        >
            <template #header="{ collapsed }">
                <RouterLink
                    class="flex items-center gap-2 font-semibold tracking-wide"
                    to="/"
                >
                    <span
                        class="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary font-bold text-inverted"
                        >W</span
                    >
                    <span v-if="!collapsed">WIND<span class="text-muted">KODE</span></span>
                </RouterLink>
            </template>

            <template #default="{ collapsed }">
                <UNavigationMenu
                    :collapsed="collapsed"
                    :items="navigation"
                    orientation="vertical"
                />
            </template>

            <template #footer="{ collapsed }">
                <div class="flex w-full items-center gap-2">
                    <UAvatar
                        :alt="auth.user?.name"
                        size="sm"
                    />
                    <div
                        v-if="!collapsed"
                        class="min-w-0 flex-1"
                    >
                        <p class="truncate text-sm font-medium">
                            {{ auth.user?.name }}
                        </p>
                        <p class="truncate text-xs text-muted">
                            {{ auth.user ? USER_ROLE_LABEL[auth.user.role] : '' }}
                        </p>
                    </div>
                    <UButton
                        aria-label="Cerrar sesión"
                        color="neutral"
                        icon="i-lucide-log-out"
                        variant="ghost"
                        @click="handleLogout"
                    />
                </div>
            </template>
        </UDashboardSidebar>

        <RouterView />
    </UDashboardGroup>
</template>
