<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}>()
</script>

<template>
  <button
    class="inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    :class="[
      variant === 'primary' && 'bg-platinum text-abyss hover:bg-halo shadow-md hover:shadow-lg hover:shadow-ink/10',
      variant === 'secondary' && 'border border-steel/50 text-silver hover:border-jade-soft/60 hover:bg-jade/5 hover:text-jade',
      variant === 'ghost' && 'text-steel hover:text-jade hover:bg-jade/5',
      size === 'sm' && 'px-4 py-1.5 text-sm',
      size === 'md' && 'px-5 py-2.5 text-base',
      size === 'lg' && 'px-7 py-3 text-lg',
    ]"
  >
    <slot />
  </button>
</template>
