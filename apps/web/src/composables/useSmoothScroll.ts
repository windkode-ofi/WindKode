import Lenis from 'lenis'
import { onBeforeUnmount, onMounted } from 'vue'

/** Altura aproximada de la navbar: las anclas quedan por debajo de ella. */
const ANCHOR_OFFSET = -88

let lenis: Lenis | null = null

/**
 * Scroll suave con inercia (Lenis) para toda la página. Se inicia una sola vez
 * desde App.vue; con `prefers-reduced-motion` se queda el scroll nativo.
 */
export function useSmoothScroll() {
  onMounted(() => {
    if (lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    lenis = new Lenis({ autoRaf: true, lerp: 0.1, anchors: { offset: ANCHOR_OFFSET } })
  })

  onBeforeUnmount(() => {
    lenis?.destroy()
    lenis = null
  })
}

/**
 * Desplaza a un selector o posición con Lenis. Devuelve `false` si Lenis no está
 * activo (SSR o movimiento reducido) para que el llamador use el scroll nativo.
 */
export function scrollToTarget(target: string | number, options: { immediate?: boolean } = {}): boolean {
  if (!lenis) return false
  lenis.scrollTo(target, { offset: typeof target === 'number' ? 0 : ANCHOR_OFFSET, duration: 1.3, ...options })
  return true
}

/** Congela el scroll (menú móvil abierto) y lo reanuda. */
export function setScrollLocked(locked: boolean) {
  document.documentElement.style.overflow = locked ? 'hidden' : ''
  if (locked) lenis?.stop()
  else lenis?.start()
}
