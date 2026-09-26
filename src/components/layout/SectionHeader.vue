<script setup lang="ts">
withDefaults(
  defineProps<{
    kicker?: string
    title?: string
    subtitle?: string
    align?: 'left' | 'center' | 'split'
  }>(),
  { align: 'center' },
)
</script>

<template>
  <div
    class="mb-14"
    :class="[
      align === 'center' && 'text-center',
      align === 'split' && 'flex flex-col gap-4 md:flex-row md:items-end md:justify-between',
    ]"
  >
    <div>
      <p v-if="kicker" class="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-steel">
        {{ kicker }}
      </p>
      <h2 class="font-display text-metal text-4xl uppercase leading-[0.95] sm:text-5xl md:text-7xl">
        <slot name="title">{{ title }}</slot>
      </h2>
      <p v-if="subtitle && align !== 'split'" class="mt-4 text-sm text-silver/60">
        {{ subtitle }}
      </p>
    </div>
    <p v-if="subtitle && align === 'split'" class="max-w-sm text-sm leading-relaxed text-silver/60">
      {{ subtitle }}
    </p>
  </div>
</template>
