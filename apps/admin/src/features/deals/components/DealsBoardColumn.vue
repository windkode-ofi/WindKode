<script setup lang="ts">
    import type { Deal, DealStage } from '@windkode/shared'

    import { DEAL_STAGE_COLOR, DEAL_STAGE_LABEL, formatMoney, sumAmounts } from '@windkode/shared'
    import { computed, ref, useTemplateRef } from 'vue'

    import DealCard from './DealCard.vue'

    const { deals, stage } = defineProps<{ deals: Deal[]; stage: DealStage }>()

    const emit = defineEmits<{ drop: [dealId: string, stage: DealStage, position: number]; open: [deal: Deal] }>()

    const list = useTemplateRef<HTMLDivElement>('list')
    const isOver = ref(false)

    /** Totales por moneda: no se mezclan bolivianos con dólares. */
    const totals = computed(() =>
        (['BOB', 'USD'] as const)
            .map((currency) => ({
                amounts: deals.filter((deal) => deal.currency === currency).map((deal) => deal.amount),
                currency,
            }))
            .filter((group) => group.amounts.length)
            .map((group) => formatMoney(sumAmounts(group.amounts), group.currency)),
    )

    const handleDragStart = (event: DragEvent) => {
        const card = (event.target as HTMLElement).closest<HTMLElement>('[data-deal-id]')

        if (card?.dataset.dealId) event.dataTransfer?.setData('text/plain', card.dataset.dealId)
    }

    /** Índice de inserción según la posición vertical del puntero respecto al centro de cada tarjeta. */
    const dropIndex = (clientY: number): number => {
        const cards = Array.from(list.value?.querySelectorAll<HTMLElement>('[data-deal-id]') ?? [])
        const index = cards.findIndex((card) => {
            const rect = card.getBoundingClientRect()

            return clientY < rect.top + rect.height / 2
        })

        return index === -1 ? cards.length : index
    }

    const handleDrop = (event: DragEvent) => {
        isOver.value = false

        const dealId = event.dataTransfer?.getData('text/plain')

        if (!dealId) return

        const current = deals.findIndex((deal) => deal.id === dealId)
        const index = dropIndex(event.clientY)
        // Dentro de la misma columna, la tarjeta arrastrada todavía ocupa su lugar: se descuenta.
        const position = current !== -1 && current < index ? index - 1 : index

        if (current === position) return

        emit('drop', dealId, stage, position)
    }
</script>

<template>
    <section
        class="flex w-72 shrink-0 flex-col rounded-lg bg-elevated/50 ring-1 ring-default transition"
        :class="{ 'ring-2 ring-primary/60': isOver }"
        @dragleave="isOver = false"
        @dragover.prevent="isOver = true"
        @drop.prevent="handleDrop"
    >
        <header class="flex items-center justify-between gap-2 px-3 pt-3">
            <div class="flex items-center gap-2">
                <UBadge
                    :color="DEAL_STAGE_COLOR[stage]"
                    :label="DEAL_STAGE_LABEL[stage]"
                    variant="subtle"
                />
                <span class="text-xs text-muted">{{ deals.length }}</span>
            </div>
        </header>
        <p class="px-3 pt-1 text-xs text-dimmed">
            {{ totals.join(' · ') || 'Sin monto' }}
        </p>

        <div
            ref="list"
            class="flex min-h-24 flex-1 flex-col gap-2 p-3"
            @dragstart="handleDragStart"
        >
            <DealCard
                v-for="deal in deals"
                :key="deal.id"
                :deal="deal"
                @open="emit('open', $event)"
            />
            <p
                v-if="!deals.length"
                class="rounded-md border border-dashed border-default py-6 text-center text-xs text-dimmed"
            >
                Arrastra aquí
            </p>
        </div>
    </section>
</template>
