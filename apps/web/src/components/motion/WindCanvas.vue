<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { prefersReducedMotion } from '@/composables/useScrollProgress'

/**
 * Fondo del hero: estrellas que derivan empujadas por el viento (algunas
 * titilan en verde en tema oscuro) y ráfagas de viento que cruzan de izquierda
 * a derecha. Los colores salen de los tokens del tema (`--color-ink` y
 * `--color-jade-soft`, que solo es verde en oscuro).
 */
type Star = { x: number; y: number; vx: number; vy: number; r: number; accent: boolean; phase: number }
type Gust = { x: number; y: number; len: number; speed: number; amp: number; phase: number; alpha: number }

const WIND = 0.22

const canvas = ref<HTMLCanvasElement | null>(null)

let ctx: CanvasRenderingContext2D | null = null
let stars: Star[] = []
let gusts: Gust[] = []
let width = 0
let height = 0
let raf = 0
let visible = true
let frameCount = 0
let reduced = false
let ink = '14, 16, 19'
let accent = '100, 112, 132'
let observer: IntersectionObserver | null = null

/** Convierte un color CSS calculado (`rgb(...)`/hex) en «r, g, b». */
function toRgb(value: string, fallback: string) {
  const probe = document.createElement('span')
  probe.style.color = value
  document.body.appendChild(probe)
  const rgb = getComputedStyle(probe).color.match(/\d+(\.\d+)?/g)
  probe.remove()
  return rgb && rgb.length >= 3 ? rgb.slice(0, 3).join(', ') : fallback
}

function readColors() {
  const styles = getComputedStyle(document.documentElement)
  ink = toRgb(styles.getPropertyValue('--color-ink').trim(), ink)
  accent = toRgb(styles.getPropertyValue('--color-jade-soft').trim(), accent)
}

function makeGust(randomX: boolean): Gust {
  return {
    x: randomX ? Math.random() * width : -Math.random() * width * 0.5,
    y: Math.random() * height,
    len: 80 + Math.random() * 220,
    speed: 2.5 + Math.random() * 4,
    amp: 6 + Math.random() * 14,
    phase: Math.random() * Math.PI * 2,
    alpha: 0.05 + Math.random() * 0.1,
  }
}

function resize() {
  const el = canvas.value
  if (!el || !ctx) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  width = el.clientWidth
  height = el.clientHeight
  el.width = width * dpr
  el.height = height * dpr
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  const count = Math.round(Math.min(100, (width * height) / 15000))
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: Math.random() * 0.35,
    vy: (Math.random() - 0.5) * 0.2,
    r: Math.random() * 1.4 + 0.6,
    accent: Math.random() < 0.12,
    phase: Math.random() * Math.PI * 2,
  }))
  gusts = Array.from({ length: Math.round(Math.max(4, width / 220)) }, () => makeGust(true))
  if (reduced) draw()
}

function drawGusts() {
  if (!ctx) return
  for (const g of gusts) {
    if (!reduced) {
      g.x += g.speed
      g.phase += 0.02
      if (g.x - g.len > width) Object.assign(g, makeGust(false))
    }
    const grad = ctx.createLinearGradient(g.x - g.len, 0, g.x, 0)
    grad.addColorStop(0, `rgba(${ink}, 0)`)
    grad.addColorStop(1, `rgba(${ink}, ${g.alpha})`)
    ctx.strokeStyle = grad
    ctx.lineWidth = 1
    ctx.beginPath()
    for (let s = 0; s <= 12; s++) {
      const px = g.x - g.len + (g.len * s) / 12
      const py = g.y + Math.sin(g.phase + s * 0.35) * g.amp * (s / 12)
      if (s === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.stroke()
  }
}

function draw() {
  if (!ctx) return
  if (++frameCount % 45 === 0) readColors()
  ctx.clearRect(0, 0, width, height)
  drawGusts()

  for (const n of stars) {
    if (!reduced) {
      n.x += n.vx + WIND
      n.y += n.vy
      n.phase += 0.03
      if (n.x > width + 10) n.x = -10
      if (n.y < 0 || n.y > height) n.vy *= -1
    }
    const twinkle = 0.25 + 0.2 * (1 + Math.sin(n.phase))
    ctx.fillStyle = n.accent ? `rgba(${accent}, ${(twinkle + 0.25).toFixed(3)})` : `rgba(${ink}, ${twinkle.toFixed(3)})`
    ctx.beginPath()
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
    ctx.fill()
  }

  if (visible && !reduced) raf = requestAnimationFrame(draw)
}

function onVisibility() {
  cancelAnimationFrame(raf)
  if (!document.hidden && visible && !reduced) raf = requestAnimationFrame(draw)
}

onMounted(() => {
  ctx = canvas.value?.getContext('2d') ?? null
  if (!canvas.value || !ctx) return
  reduced = prefersReducedMotion()
  readColors()
  resize()

  observer = new IntersectionObserver(([entry]) => {
    visible = Boolean(entry?.isIntersecting)
    cancelAnimationFrame(raf)
    if (visible && !reduced) raf = requestAnimationFrame(draw)
  })
  observer.observe(canvas.value)
  window.addEventListener('resize', resize)
  document.addEventListener('visibilitychange', onVisibility)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  observer?.disconnect()
  window.removeEventListener('resize', resize)
  document.removeEventListener('visibilitychange', onVisibility)
})
</script>

<template>
  <canvas ref="canvas" aria-hidden="true" />
</template>
