<script setup lang="ts">
    import type { Deal } from '@windkode/shared'

    import { formatMoney } from '@windkode/shared'

    import { formatDate } from '~/shared/utils/date'

    const { deal } = defineProps<{ deal: Deal }>()

    const emit = defineEmits<{ open: [deal: Deal] }>()
</script>

<template>
    <button
        class="w-full cursor-grab rounded-md border border-default bg-default p-3 text-left shadow-xs transition hover:border-primary/60 active:cursor-grabbing"
        :data-deal-id="deal.id"
        draggable="true"
        type="button"
        @click="emit('open', deal)"
    >
        <p class="text-sm leading-snug font-medium">
            {{ deal.title }}
        </p>
        <p class="mt-1 truncate text-xs text-muted">
            {{ deal.client.name }}<template v-if="deal.client.company"> · {{ deal.client.company }} </template>
        </p>
        <div class="mt-3 flex items-center justify-between gap-2 text-xs">
            <span class="font-semibold text-highlighted">{{ formatMoney(deal.amount, deal.currency) }}</span>
            <span
                v-if="deal.expectedCloseAt"
                class="inline-flex items-center gap-1 text-muted"
            >
                <UIcon
                    class="size-3"
                    name="i-lucide-calendar"
                />
                {{ formatDate(deal.expectedCloseAt) }}
            </span>
        </div>
        <p class="mt-2 text-xs text-dimmed">
            {{ deal.owner.name }}
        </p>
    </button>
</template>
