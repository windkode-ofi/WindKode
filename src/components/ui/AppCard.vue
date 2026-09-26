<script setup lang="ts">
defineProps<{
  hover?: boolean
}>()
</script>

<template>
  <article
    class="rounded-2xl border border-ink/10 bg-ink/[0.03] p-6 backdrop-blur-sm transition-all duration-300"
    :class="hover && 'hover:-translate-y-1.5 hover:border-jade-soft/30 hover:bg-carbon/60 hover:shadow-lg hover:shadow-veil/30'"
  >
    <slot />
  </article>
</template>
