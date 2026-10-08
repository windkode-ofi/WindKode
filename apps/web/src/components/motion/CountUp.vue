<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'
import { prefersReducedMotion } from '@/composables/useScrollProgress'

/**
 * Cifra que cuenta desde 0 al entrar en pantalla. Acepta valores como
 * `12+`, `100%` o `24/7` (anima el número inicial y conserva el resto).
 * El HTML prerenderizado lleva el valor final.
 */
const props = withDefaults(defineProps<{ value: string; duration?: number }>(), { duration: 1600 })

const match = props.value.match(/^(\d+)(.*)$/)
const target = match ? Number(match[1]) : null
const suffix = match?.[2] ?? ''

const display = ref(props.value)
const el = ref<HTMLElement | null>(null)
const { isVisible } = useIntersectionObserver(() => el.value, { threshold: 0.4 })
let raf = 0

onMounted(() => {
  if (target !== null && !prefersReducedMotion() && !isVisible.value) display.value = `0${suffix}`
})

watch(isVisible, (visible) => {
  if (!visible || target === null || prefersReducedMotion()) return
  const start = performance.now()
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / props.duration)
    const eased = 1 - Math.pow(1 - t, 4)
    display.value = `${Math.round(eased * target)}${suffix}`
    if (t < 1) raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)
})

onBeforeUnmount(() => cancelAnimationFrame(raf))
</script>

<template>
  <span ref="el" class="tabular-nums">{{ display }}</span>
</template>
