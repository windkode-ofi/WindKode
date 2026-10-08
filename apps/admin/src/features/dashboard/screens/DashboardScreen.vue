<script setup lang="ts">
    import type { Client, Currency, Deal } from '@windkode/shared'

    import {
        CLIENT_STATUS_COLOR,
        CLIENT_STATUS_LABEL,
        DEAL_CLOSED_STAGES,
        DEAL_STAGE_LABEL,
        DEAL_STAGES,
        formatMoney,
        sumAmounts,
    } from '@windkode/shared'
    import { computed, onMounted, ref } from 'vue'

    import CommonStatCard from '~/shared/components/common/CommonStatCard.vue'
    import CommonStatusBadge from '~/shared/components/common/CommonStatusBadge.vue'
    import { useAppToast } from '~/shared/composables/useAppToast'
    import { useAuthStore } from '~/shared/stores/authStore'
    import { formatDate } from '~/shared/utils/date'

    import { clientsService } from '../../clients/services/clientsService'
    import { dealsService } from '../../deals/services/dealsService'

    const auth = useAuthStore()
    const toast = useAppToast()

    const deals = ref<Deal[]>([])
    const recentClients = ref<Client[]>([])
    const totalClients = ref(0)
    const isLoading = ref(true)

    /** Suma por moneda, ej. "Bs 10.700,00 · US$ 900,00". */
    const totalByCurrency = (items: Deal[]): string =>
        (['BOB', 'USD'] as const satisfies readonly Currency[])
            .map((currency) => ({
                amounts: items.filter((deal) => deal.currency === currency).map((deal) => deal.amount),
                currency,
            }))
            .filter((group) => group.amounts.length)
            .map((group) => formatMoney(sumAmounts(group.amounts), group.currency))
            .join(' · ') || formatMoney(0, 'BOB')

    const openDeals = computed(() =>
        deals.value.filter((deal) => !(DEAL_CLOSED_STAGES as readonly string[]).includes(deal.stage)),
    )
    const wonDeals = computed(() => deals.value.filter((deal) => deal.stage === 'WON'))
    const lostDeals = computed(() => deals.value.filter((deal) => deal.stage === 'LOST'))
    const stageCounts = computed(() =>
        DEAL_STAGES.map((stage) => ({ count: deals.value.filter((deal) => deal.stage === stage).length, stage })),
    )
    const maxStageCount = computed(() => Math.max(1, ...stageCounts.value.map((item) => item.count)))

    onMounted(async () => {
        const [dealsResult, clientsResult] = await Promise.all([
            dealsService.findAll(),
            clientsService.findAll({ page: 1, pageSize: 5 }),
        ])

        isLoading.value = false

        if (dealsResult.success) deals.value = dealsResult.data
        else toast.error(dealsResult.error)

        if (clientsResult.success) {
            recentClients.value = clientsResult.data.items
            totalClients.value = clientsResult.data.total
        } else toast.error(clientsResult.error)
    })
</script>

<template>
    <UDashboardPanel id="dashboard">
        <template #header>
            <UDashboardNavbar :title="`Hola, ${auth.user?.name.split(' ')[0] ?? ''}`">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>
            </UDashboardNavbar>
        </template>

        <template #body>
            <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <CommonStatCard
                    :description="`${openDeals.length} oportunidades abiertas`"
                    icon="i-lucide-trending-up"
                    title="Embudo abierto"
                    :value="isLoading ? '…' : totalByCurrency(openDeals)"
                />
                <CommonStatCard
                    :description="`${wonDeals.length} oportunidades ganadas`"
                    icon="i-lucide-trophy"
                    title="Ganado"
                    :value="isLoading ? '…' : totalByCurrency(wonDeals)"
                />
                <CommonStatCard
                    :description="`${lostDeals.length} oportunidades perdidas`"
                    icon="i-lucide-circle-x"
                    title="Perdido"
                    :value="isLoading ? '…' : totalByCurrency(lostDeals)"
                />
                <CommonStatCard
                    description="Contactos en el CRM"
                    icon="i-lucide-contact"
                    title="Clientes"
                    :value="isLoading ? '…' : String(totalClients)"
                />
            </div>

            <div class="grid gap-4 lg:grid-cols-2">
                <UCard>
                    <template #header>
                        <div class="flex items-center justify-between">
                            <p class="font-medium">Oportunidades por etapa</p>
                            <UButton
                                color="neutral"
                                label="Ver tablero"
                                size="sm"
                                to="/ventas"
                                trailingIcon="i-lucide-arrow-right"
                                variant="ghost"
                            />
                        </div>
                    </template>
                    <ul class="space-y-3">
                        <li
                            v-for="item in stageCounts"
                            :key="item.stage"
                            class="grid grid-cols-[7rem_1fr_2rem] items-center gap-3 text-sm"
                        >
                            <span class="text-muted">{{ DEAL_STAGE_LABEL[item.stage] }}</span>
                            <span class="h-2 overflow-hidden rounded-full bg-elevated">
                                <span
                                    class="block h-full rounded-full bg-primary"
                                    :style="{ width: `${(item.count / maxStageCount) * 100}%` }"
                                />
                            </span>
                            <span class="text-right font-medium">{{ item.count }}</span>
                        </li>
                    </ul>
                </UCard>

                <UCard>
                    <template #header>
                        <div class="flex items-center justify-between">
                            <p class="font-medium">Clientes recientes</p>
                            <UButton
                                color="neutral"
                                label="Ver todos"
                                size="sm"
                                to="/clientes"
                                trailingIcon="i-lucide-arrow-right"
                                variant="ghost"
                            />
                        </div>
                    </template>
                    <p
                        v-if="!isLoading && !recentClients.length"
                        class="text-sm text-muted"
                    >
                        Aún no hay clientes registrados.
                    </p>
                    <ul class="divide-y divide-default">
                        <li
                            v-for="client in recentClients"
                            :key="client.id"
                        >
                            <RouterLink
                                class="flex items-center justify-between gap-3 py-2.5 hover:text-primary"
                                :to="{ name: 'client-detail', params: { id: client.id } }"
                            >
                                <span class="min-w-0">
                                    <span class="block truncate text-sm font-medium">{{ client.name }}</span>
                                    <span class="block truncate text-xs text-muted"
                                        >{{ client.company ?? client.jobTitle ?? '—' }} ·
                                        {{ formatDate(client.updatedAt) }}</span
                                    >
                                </span>
                                <CommonStatusBadge
                                    :colors="CLIENT_STATUS_COLOR"
                                    :labels="CLIENT_STATUS_LABEL"
                                    :value="client.status"
                                />
                            </RouterLink>
                        </li>
                    </ul>
                </UCard>
            </div>
        </template>
    </UDashboardPanel>
</template>
