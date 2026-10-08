<script setup lang="ts">
    import type { TableColumn } from '@nuxt/ui'
    import type { Client, ClientStatus } from '@windkode/shared'

    import { watchDebounced } from '@vueuse/core'
    import { CLIENT_SOURCE_LABEL, CLIENT_STATUS_COLOR, CLIENT_STATUS_LABEL, CLIENT_STATUSES } from '@windkode/shared'
    import { h, onMounted, ref, resolveComponent, watch } from 'vue'
    import { RouterLink, useRouter } from 'vue-router'

    import CommonStatusBadge from '~/shared/components/common/CommonStatusBadge.vue'
    import { useAppToast } from '~/shared/composables/useAppToast'
    import { formatDate } from '~/shared/utils/date'

    import ClientFormSlideover from '../components/ClientFormSlideover.vue'
    import { clientsService } from '../services/clientsService'

    const PAGE_SIZE = 20

    const router = useRouter()
    const toast = useAppToast()

    const clients = ref<Client[]>([])
    const total = ref(0)
    const page = ref(1)
    const search = ref('')
    const status = ref<'ALL' | ClientStatus>('ALL')
    const isLoading = ref(false)
    const isFormOpen = ref(false)

    const statusItems = [
        { label: 'Todos los estados', value: 'ALL' as const },
        ...CLIENT_STATUSES.map((value) => ({ label: CLIENT_STATUS_LABEL[value], value })),
    ]

    const UIcon = resolveComponent('UIcon')

    const columns: TableColumn<Client>[] = [
        {
            accessorKey: 'name',
            cell: ({ row }) =>
                h(
                    RouterLink,
                    { class: 'block', to: { name: 'client-detail', params: { id: row.original.id } } },
                    () => [
                        h('p', { class: 'font-medium text-highlighted hover:text-primary' }, row.original.name),
                        h('p', { class: 'text-xs text-muted' }, row.original.jobTitle ?? 'Sin cargo registrado'),
                    ],
                ),
            header: 'Contacto',
        },
        { accessorKey: 'company', cell: ({ row }) => row.original.company ?? '—', header: 'Empresa' },
        {
            accessorKey: 'status',
            cell: ({ row }) =>
                h(CommonStatusBadge, {
                    colors: CLIENT_STATUS_COLOR,
                    labels: CLIENT_STATUS_LABEL,
                    value: row.original.status,
                }),
            header: 'Estado',
        },
        { accessorKey: 'source', cell: ({ row }) => CLIENT_SOURCE_LABEL[row.original.source], header: 'Origen' },
        {
            accessorKey: 'lastActivityAt',
            cell: ({ row }) =>
                h('span', { class: 'inline-flex items-center gap-1 text-muted' }, [
                    h(UIcon, { class: 'size-3.5', name: 'i-lucide-message-square' }),
                    formatDate(row.original.lastActivityAt),
                ]),
            header: 'Último contacto',
        },
        { accessorKey: 'owner', cell: ({ row }) => row.original.owner.name, header: 'Responsable' },
    ]

    const loadClients = async () => {
        isLoading.value = true

        const result = await clientsService.findAll({
            page: page.value,
            pageSize: PAGE_SIZE,
            search: search.value || undefined,
            status: status.value === 'ALL' ? undefined : status.value,
        })

        isLoading.value = false

        if (!result.success) {
            toast.error(result.error)

            return
        }

        clients.value = result.data.items
        total.value = result.data.total
    }

    const handleSaved = async (client: Client) => {
        await router.push({ name: 'client-detail', params: { id: client.id } })
    }

    // Al cambiar un filtro se vuelve a la primera página; la página dispara la carga.
    const resetToFirstPage = () => (page.value === 1 ? loadClients() : (page.value = 1))

    watchDebounced(search, resetToFirstPage, { debounce: 300 })
    watch(status, resetToFirstPage)
    watch(page, loadClients)

    onMounted(loadClients)
</script>

<template>
    <UDashboardPanel id="clients">
        <template #header>
            <UDashboardNavbar title="Clientes">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>
                <template #right>
                    <UButton
                        icon="i-lucide-user-plus"
                        label="Nuevo cliente"
                        @click="isFormOpen = true"
                    />
                </template>
            </UDashboardNavbar>
            <UDashboardToolbar>
                <UInput
                    v-model="search"
                    class="w-full max-w-xs"
                    icon="i-lucide-search"
                    placeholder="Buscar por nombre, empresa o correo"
                />
                <USelect
                    v-model="status"
                    class="w-48"
                    :items="statusItems"
                />
            </UDashboardToolbar>
        </template>

        <template #body>
            <UTable
                :columns="columns"
                :data="clients"
                empty="No hay clientes con esos filtros."
                :loading="isLoading"
            />
            <div
                v-if="total > PAGE_SIZE"
                class="flex justify-end border-t border-default pt-4"
            >
                <UPagination
                    v-model:page="page"
                    :itemsPerPage="PAGE_SIZE"
                    :total="total"
                />
            </div>

            <ClientFormSlideover
                v-model:open="isFormOpen"
                @saved="handleSaved"
            />
        </template>
    </UDashboardPanel>
</template>
