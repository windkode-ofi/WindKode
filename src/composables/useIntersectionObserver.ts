import { ref, onMounted, onUnmounted } from 'vue'

export function useIntersectionObserver(
  target: HTMLElement | (() => HTMLElement | null),
  options?: IntersectionObserverInit,
) {
  const isVisible = ref(false)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    const el = typeof target === 'function' ? target() : target
    if (!el) return

    observer = new IntersectionObserver((entries) => {
      const entry = entries[0]
      if (entry?.isIntersecting) {
        isVisible.value = true
        observer?.unobserve(el)
      }
    }, options)

    observer.observe(el)
  })

  onUnmounted(() => observer?.disconnect())

  return { isVisible }
}
