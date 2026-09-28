<script setup lang="ts">
import { ref } from 'vue'
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'

/**
 * Titular por líneas enmascaradas: cada línea sube desde detrás de una máscara
 * enderezándose, escalonada. `mode="view"` la dispara al entrar en pantalla;
 * `mode="load"` usa una animación CSS al cargar (hero, con `.intro-gate`).
 * El texto completo va siempre en el HTML (indexable).
 */
const props = withDefaults(
  defineProps<{
    lines: string[]
    as?: 'h1' | 'h2' | 'h3' | 'p' | 'div'
    mode?: 'view' | 'load'
    /** Retraso inicial (ms). */
    delay?: number
    /** Separación entre líneas (ms). */
    stagger?: number
    lineClass?: string
    /** Clase por línea (sustituye a `lineClass` en esa línea), p. ej. una línea en contorno. */
    lineClasses?: (string | undefined)[]
  }>(),
  { as: 'h2', mode: 'view', delay: 0, stagger: 90, lineClass: '', lineClasses: () => [] },
)

const el = ref<HTMLElement | null>(null)
const { isVisible } = useIntersectionObserver(() => (props.mode === 'view' ? el.value : null), {
  rootMargin: '0px 0px -10% 0px',
})

function lineStyle(i: number) {
  const ms = `${props.delay + i * props.stagger}ms`
  return props.mode === 'load' ? { animationDelay: ms } : { '--line-delay': ms }
}
</script>

<template>
  <component :is="as" ref="el" :class="{ 'is-visible': isVisible }">
    <span v-for="(line, i) in lines" :key="i" class="mask-line">
      <span :class="[lineClasses[i] ?? lineClass, mode === 'load' && 'animate-rise-tilt']" :style="lineStyle(i)">{{ line }}</span>
    </span>
  </component>
</template>
