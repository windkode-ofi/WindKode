<script setup lang="ts">
    import type { ClientSummary, Deal } from '@windkode/shared'

    import { onMounted, ref } from 'vue'

    import { useAppToast } from '~/shared/composables/useAppToast'

    import { clientsService } from '../../clients/services/clientsService'
    import DealFormModal from '../components/DealFormModal.vue'
    import DealsBoardColumn from '../components/DealsBoardColumn.vue'
    import { useDealsBoard } from '../composables/useDealsBoard'

    const toast = useAppToast()
    const board = useDealsBoard()

    const clients = ref<ClientSummary[]>([])
    const selectedDeal = ref<Deal | null>(null)
    const isModalOpen = ref(false)

    const openCreate = () => {
        selectedDeal.value = null
        isModalOpen.value = true
    }

    const handleOpen = (deal: Deal) => {
        selectedDeal.value = deal
        isModalOpen.value = true
    }

    const handleRemove = async (deal: Deal) => {
        if (await board.removeDeal(deal.id)) isModalOpen.value = false
    }

    const loadClients = async () => {
        const result = await clientsService.findOptions()

        if (result.success) clients.value = result.data
        else toast.error(result.error)
    }

    onMounted(() => Promise.all([board.load(), loadClients()]))
</script>

<template>
    <UDashboardPanel id="deals">
        <template #header>
            <UDashboardNavbar title="Ventas">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>
                <template #right>
                    <UButton
                        icon="i-lucide-plus"
                        label="Nueva oportunidad"
                        @click="openCreate"
                    />
                </template>
            </UDashboardNavbar>
        </template>

        <template #body>
            <UAlert
                v-if="!board.isLoading.value && !clients.length"
                color="info"
                description="Para crear oportunidades primero registra un cliente."
                icon="i-lucide-info"
                variant="subtle"
            />
            <div class="flex h-full gap-4 overflow-x-auto pb-4">
                <DealsBoardColumn
                    v-for="column in board.columns.value"
                    :key="column.stage"
                    :deals="column.deals"
                    :stage="column.stage"
                    @drop="board.moveDeal"
                    @open="handleOpen"
                />
            </div>

            <DealFormModal
                v-model:open="isModalOpen"
                :clients="clients"
                :deal="selectedDeal"
                @remove="handleRemove"
                @saved="board.upsertDeal"
            />
        </template>
    </UDashboardPanel>
</template>
