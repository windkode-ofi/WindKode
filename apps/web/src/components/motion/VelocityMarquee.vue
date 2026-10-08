<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { prefersReducedMotion } from '@/composables/useScrollProgress'

/**
 * Cinta infinita cuya velocidad y dirección responden al scroll: al bajar
 * acelera en su sentido, al subir se invierte, y se inclina con la velocidad.
 * El contenido (slot) se repite 4 veces; la pista se desplaza entre -50% y -25%.
 */
const props = withDefaults(defineProps<{ baseVelocity?: number }>(), { baseVelocity: 3 })

const root = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)

let raf = 0
let x = -25
let direction = 1
let lastTime = 0
let lastScroll = 0
let velocity = 0
let visible = true
let observer: IntersectionObserver | null = null

/** Envuelve `v` en el rango [min, max). */
function wrap(min: number, max: number, v: number) {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

function frame(time: number) {
  const dt = lastTime ? Math.min(64, time - lastTime) : 16
  lastTime = time

  // Velocidad del scroll (px/s) suavizada.
  const scrollY = window.scrollY
  const instant = ((scrollY - lastScroll) / dt) * 1000
  lastScroll = scrollY
  velocity += (instant - velocity) * 0.12

  const factor = (velocity / 1000) * 5
  if (factor < -0.01) direction = -1
  else if (factor > 0.01) direction = 1

  let moveBy = direction * props.baseVelocity * (dt / 1000)
  moveBy += moveBy * Math.abs(factor)
  x = wrap(-50, -25, x + moveBy)

  const skew = Math.max(-8, Math.min(8, (-velocity / 2000) * 8))
  if (track.value) track.value.style.transform = `translate3d(${x}%, 0, 0) skewX(${skew.toFixed(2)}deg)`

  if (visible) raf = requestAnimationFrame(frame)
}

onMounted(() => {
  lastScroll = window.scrollY
  if (prefersReducedMotion()) return
  observer = new IntersectionObserver(([entry]) => {
    visible = Boolean(entry?.isIntersecting)
    cancelAnimationFrame(raf)
    lastTime = 0
    if (visible) raf = requestAnimationFrame(frame)
  })
  if (root.value) observer.observe(root.value)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  observer?.disconnect()
})
</script>

<template>
  <div ref="root" class="flex overflow-hidden whitespace-nowrap">
    <div ref="track" class="flex shrink-0 flex-nowrap will-change-transform" style="transform: translate3d(-25%, 0, 0)">
      <div v-for="i in 4" :key="i" class="flex shrink-0 items-center" :aria-hidden="i > 1 ? 'true' : undefined">
        <slot />
      </div>
    </div>
  </div>
</template>
