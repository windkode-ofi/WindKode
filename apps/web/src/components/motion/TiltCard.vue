<script setup lang="ts">
import { ref } from 'vue'

/**
 * Envoltorio interactivo para tarjetas: se inclina en 3D hacia el cursor y
 * proyecta un foco de luz (`.spotlight`, color `--spot`) que lo sigue.
 * Solo con ratón; en táctil queda estático.
 */
const props = withDefaults(
  defineProps<{
    /** Inclinación máxima en grados. */
    max?: number
    /** Radio de las esquinas (debe coincidir con la tarjeta para recortar el foco). */
    rounded?: string
  }>(),
  { max: 6, rounded: 'rounded-2xl' },
)

const el = ref<HTMLElement | null>(null)
const style = ref<Record<string, string>>({})

function onMove(e: PointerEvent) {
  if (e.pointerType !== 'mouse' || !el.value) return
  const r = el.value.getBoundingClientRect()
  const px = (e.clientX - r.left) / r.width
  const py = (e.clientY - r.top) / r.height
  style.value = {
    '--mx': `${(px * 100).toFixed(1)}%`,
    '--my': `${(py * 100).toFixed(1)}%`,
    transform: `perspective(900px) rotateX(${((0.5 - py) * props.max * 2).toFixed(2)}deg) rotateY(${((px - 0.5) * props.max * 2).toFixed(2)}deg)`,
  }
}

function onLeave() {
  style.value = { ...style.value, transform: 'perspective(900px) rotateX(0deg) rotateY(0deg)' }
}
</script>

<template>
  <div
    ref="el"
    class="group relative h-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transform-none!"
    :class="rounded"
    :style="style"
    @pointermove="onMove"
    @pointerleave="onLeave"
  >
    <slot />
    <span class="spotlight" aria-hidden="true" />
  </div>
</template>
