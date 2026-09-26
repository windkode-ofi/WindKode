export function useScrollTo() {
  function scrollTo(el: string | HTMLElement) {
    const target = typeof el === 'string' ? document.querySelector(el) : el
    target?.scrollIntoView({ behavior: 'smooth' })
  }

  return { scrollTo }
}
