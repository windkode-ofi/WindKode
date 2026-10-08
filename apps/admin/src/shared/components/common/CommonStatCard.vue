<script setup lang="ts">
    const {
        description = '',
        icon,
        title,
        value,
    } = defineProps<{ description?: string; icon: string; title: string; value: string }>()
</script>

<template>
    <UCard>
        <div class="flex items-start justify-between gap-3">
            <div class="min-w-0 space-y-1">
                <p class="text-sm text-muted">
                    {{ title }}
                </p>
                <p class="truncate text-2xl font-semibold">
                    {{ value }}
                </p>
                <p
                    v-if="description"
                    class="text-xs text-dimmed"
                >
                    {{ description }}
                </p>
            </div>
            <span class="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <UIcon
                    class="size-5"
                    :name="icon"
                />
            </span>
        </div>
    </UCard>
</template>
