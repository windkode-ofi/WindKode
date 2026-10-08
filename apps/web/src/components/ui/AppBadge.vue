<script setup lang="ts">
defineProps<{
  variant?: 'default' | 'skill'
}>()
</script>

<template>
  <span
    class="inline-block rounded-full px-3 py-1 text-xs font-medium"
    :class="[
      variant === 'skill' && 'bg-ink/5 text-silver border border-ink/10',
      variant === 'default' && 'bg-ink/10 text-silver',
    ]"
  >
    <slot />
  </span>
</template>
