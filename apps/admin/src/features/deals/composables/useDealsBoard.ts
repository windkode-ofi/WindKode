import type { Deal, DealStage } from '@windkode/shared'

import { DEAL_STAGES, insertAtPosition } from '@windkode/shared'
import { computed, ref } from 'vue'

import { useAppToast } from '~/shared/composables/useAppToast'

import { dealsService } from '../services/dealsService'

/** Estado del tablero: columnas por etapa y movimiento optimista con rollback si la api falla. */
export const useDealsBoard = () => {
    const toast = useAppToast()
    const deals = ref<Deal[]>([])
    const isLoading = ref(false)

    const columns = computed(() =>
        DEAL_STAGES.map((stage) => ({
            deals: deals.value.filter((deal) => deal.stage === stage).sort((a, b) => a.position - b.position),
            stage,
        })),
    )

    const load = async () => {
        isLoading.value = true

        const result = await dealsService.findAll()

        isLoading.value = false

        if (!result.success) {
            toast.error(result.error)

            return
        }

        deals.value = result.data
    }

    /** Aplica en local el mismo reordenamiento que hace la api, para que la tarjeta se mueva al instante. */
    const applyMove = (current: Deal[], dealId: string, stage: DealStage, position: number): Deal[] => {
        const moved = current.find((deal) => deal.id === dealId)

        if (!moved) return current

        const targetOrder = insertAtPosition(
            current
                .filter((deal) => deal.stage === stage)
                .sort((a, b) => a.position - b.position)
                .map((deal) => deal.id),
            dealId,
            position,
        )
        const sourceOrder = current
            .filter((deal) => deal.stage === moved.stage && deal.id !== dealId)
            .sort((a, b) => a.position - b.position)
            .map((deal) => deal.id)

        return current.map((deal) => {
            if (targetOrder.includes(deal.id)) return { ...deal, position: targetOrder.indexOf(deal.id), stage }
            if (sourceOrder.includes(deal.id)) return { ...deal, position: sourceOrder.indexOf(deal.id) }

            return deal
        })
    }

    const moveDeal = async (dealId: string, stage: DealStage, position: number) => {
        const snapshot = deals.value

        deals.value = applyMove(snapshot, dealId, stage, position)

        const result = await dealsService.move(dealId, { position, stage })

        if (!result.success) {
            deals.value = snapshot
            toast.error(result.error, 'No se pudo mover la oportunidad')
        }
    }

    const upsertDeal = (deal: Deal) => {
        deals.value = deals.value.some((item) => item.id === deal.id)
            ? deals.value.map((item) => (item.id === deal.id ? deal : item))
            : [...deals.value, deal]
    }

    const removeDeal = async (dealId: string) => {
        const result = await dealsService.remove(dealId)

        if (!result.success) {
            toast.error(result.error)

            return false
        }

        // La api renumera la columna: se recarga para quedar en sincronía.
        await load()
        toast.success('Oportunidad eliminada')

        return true
    }

    return { columns, deals, isLoading, load, moveDeal, removeDeal, upsertDeal }
}
