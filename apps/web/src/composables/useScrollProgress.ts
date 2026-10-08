import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

type FrameCallback = () => void

/*
 * Un único listener de scroll/resize para toda la app: agrupa las lecturas en
 * un requestAnimationFrame y avisa a todos los suscriptores a la vez.
 */
const subscribers = new Set<FrameCallback>()
let scheduled = false
let listening = false

function flush() {
  scheduled = false
  subscribers.forEach((cb) => cb())
}

function schedule() {
  if (scheduled) return
  scheduled = true
  requestAnimationFrame(flush)
}

/** Ejecuta `cb` una vez por frame mientras haya scroll o cambios de tamaño. */
export function onScrollFrame(cb: FrameCallback) {
  onMounted(() => {
    subscribers.add(cb)
    if (!listening) {
      window.addEventListener('scroll', schedule, { passive: true })
      window.addEventListener('resize', schedule, { passive: true })
      listening = true
    }
    cb()
  })
  onBeforeUnmount(() => subscribers.delete(cb))
}

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/**
 * Progreso (0 → 1) de un elemento a su paso por la ventana.
 * `offset = [a, b]`: vale 0 cuando el borde superior del elemento está en la
 * fracción `a` de la ventana y 1 cuando su borde inferior llega a la fracción `b`.
 *   [0, 0] → desde que su parte superior toca arriba hasta que sale (hero)
 *   [1, 0] → desde que asoma por abajo hasta que sale por arriba
 *   [0, 1] → mientras está fijado (sticky) ocupando la ventana
 * `initial` es el valor del HTML prerenderizado (antes de medir); con movimiento
 * reducido se queda en ese valor.
 */
export function useScrollProgress(target: Ref<HTMLElement | null>, offset: [number, number], initial = 1) {
  const progress = ref(initial)
  const [a, b] = offset

  onScrollFrame(() => {
    const el = target.value
    if (!el || prefersReducedMotion()) return
    const rect = el.getBoundingClientRect()
    const vh = window.innerHeight
    const span = (a - b) * vh + rect.height
    progress.value = span > 0 ? clamp01((a * vh - rect.top) / span) : 1
  })

  return progress
}
