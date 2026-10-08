<script setup lang="ts" generic="T extends string">
    import type { UIColor } from '@windkode/shared'

    /** Badge para cualquier unión de estados con sus mapas `_LABEL` / `_COLOR` de @windkode/shared. */
    const { colors, labels, value } = defineProps<{ colors: Record<T, UIColor>; labels: Record<T, string>; value: T }>()
</script>

<template>
    <UBadge
        :color="colors[value]"
        :label="labels[value]"
        variant="subtle"
    />
</template>
