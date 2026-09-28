<script setup lang="ts">
import { ref } from 'vue'
import { onScrollFrame } from '@/composables/useScrollProgress'

/** Barra fina en el borde superior que indica cuánto se ha recorrido de la página. */
const progress = ref(0)

onScrollFrame(() => {
  const max = document.documentElement.scrollHeight - window.innerHeight
  progress.value = max > 0 ? Math.min(1, window.scrollY / max) : 0
})
</script>

<template>
  <div
    aria-hidden="true"
    class="pointer-events-none fixed inset-x-0 top-0 z-[70] h-0.5 origin-left bg-jade-soft"
    :style="{ transform: `scaleX(${progress})` }"
  />
</template>
