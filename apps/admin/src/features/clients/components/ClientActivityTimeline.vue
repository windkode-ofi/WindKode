<script setup lang="ts">
    import type { ClientActivity } from '@windkode/shared'

    import { CLIENT_ACTIVITY_TYPE_ICON, CLIENT_ACTIVITY_TYPE_LABEL } from '@windkode/shared'

    import { formatDateTime } from '~/shared/utils/date'

    const { activities } = defineProps<{ activities: ClientActivity[] }>()
</script>

<template>
    <p
        v-if="!activities.length"
        class="py-6 text-center text-sm text-muted"
    >
        Todavía no hay interacciones. Registra la primera cuando hables con el cliente.
    </p>
    <ol
        v-else
        class="space-y-4"
    >
        <li
            v-for="activity in activities"
            :key="activity.id"
            class="flex gap-3"
        >
            <span class="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-elevated text-primary">
                <UIcon
                    class="size-4"
                    :name="CLIENT_ACTIVITY_TYPE_ICON[activity.type]"
                />
            </span>
            <div class="min-w-0 flex-1">
                <p class="text-sm whitespace-pre-line">
                    {{ activity.summary }}
                </p>
                <p class="mt-1 text-xs text-muted">
                    {{ CLIENT_ACTIVITY_TYPE_LABEL[activity.type] }} · {{ formatDateTime(activity.occurredAt) }} ·
                    {{ activity.author.name }}
                </p>
            </div>
        </li>
    </ol>
</template>
