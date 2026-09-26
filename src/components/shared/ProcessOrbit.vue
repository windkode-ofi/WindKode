<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowRight, Clock, Link2, PackageCheck, X } from '@lucide/vue'
import { WLogo } from '@/components/ui'
import type { ProcessStep, ProcessStepKey } from '@/data'

/**
 * Línea de tiempo orbital: las fases giran alrededor de un núcleo.
 * Al tocar una fase la órbita se detiene, la fase sube a la posición
 * superior y despliega su tarjeta; las fases conectadas laten.
 */
const props = defineProps<{
  steps: ProcessStep[]
}>()

const { t } = useI18n()

/** Grados que avanza la órbita en cada tick (≈ 6°/s con ticks de 50 ms). */
const STEP_DEG = 0.3
const TICK_MS = 50
/** Ángulo (en grados) en el que se coloca la fase activa: arriba del todo. */
const TOP_ANGLE = 270

const root = ref<HTMLElement | null>(null)
const rotation = ref(0)
const radius = ref(200)
const activeKey = ref<ProcessStepKey | null>(null)
const reducedMotion = ref(false)

let timer: ReturnType<typeof setInterval> | undefined
let resizeObserver: ResizeObserver | null = null

const activeStep = computed(() => props.steps.find((s) => s.key === activeKey.value) ?? null)
const relatedKeys = computed<ProcessStepKey[]>(() => activeStep.value?.related ?? [])

/** Pantallas compactas: la órbita se ancla arriba y el escenario crece hacia abajo al abrir una fase. */
const compact = ref(false)
/** Espacio vertical que ocupa la tarjeta abierta bajo el nodo superior (en px). */
const CARD_SPACE = 330

const stageHeight = computed(() => {
  const diameter = radius.value * 2 + 150
  if (compact.value) return activeKey.value ? radius.value + 56 + CARD_SPACE : Math.max(diameter, 400)
  return Math.max(diameter, 520)
})
const centerY = computed(() => (compact.value ? radius.value + 56 : stageHeight.value / 2))

const stageStyle = computed(() => ({ height: `${stageHeight.value}px` }))
const centerStyle = computed(() => ({ top: `${centerY.value}px` }))
const ringStyle = computed(() => ({
  width: `${radius.value * 2}px`,
  height: `${radius.value * 2}px`,
}))

const nodes = computed(() =>
  props.steps.map((step, index) => {
    const angle = ((index / props.steps.length) * 360 + rotation.value) % 360
    const rad = (angle * Math.PI) / 180
    const x = radius.value * Math.cos(rad)
    const y = radius.value * Math.sin(rad)
    const isActive = step.key === activeKey.value
    const isRelated = relatedKeys.value.includes(step.key)
    return {
      step,
      index,
      isActive,
      isRelated,
      style: {
        transform: `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`,
        zIndex: isActive ? 200 : Math.round(100 + 50 * Math.cos(rad)),
        opacity: isActive || isRelated ? 1 : Math.max(0.7, 0.7 + 0.3 * ((1 + Math.sin(rad)) / 2)),
      },
    }
  }),
)

function startRotation() {
  if (timer || reducedMotion.value) return
  timer = setInterval(() => {
    rotation.value = Number(((rotation.value + STEP_DEG) % 360).toFixed(3))
  }, TICK_MS)
}

function stopRotation() {
  if (!timer) return
  clearInterval(timer)
  timer = undefined
}

function focusOn(key: ProcessStepKey) {
  const index = props.steps.findIndex((s) => s.key === key)
  if (index < 0) return
  rotation.value = TOP_ANGLE - (index / props.steps.length) * 360
}

function select(key: ProcessStepKey) {
  if (activeKey.value === key) {
    reset()
    return
  }
  activeKey.value = key
  stopRotation()
  focusOn(key)
}

function reset() {
  activeKey.value = null
  startRotation()
}

function stepLabel(step: ProcessStep) {
  return t(`proceso.pasos.${step.key}.titulo`)
}

function phaseNumber(index: number) {
  return String(index + 1).padStart(2, '0')
}

function measure() {
  const width = root.value?.clientWidth ?? 0
  if (!width) return
  compact.value = width < 640
  // Deja margen para nodos y etiquetas; en móvil la órbita se compacta.
  radius.value = Math.round(Math.min(240, Math.max(118, width / 2 - 64)))
}

onMounted(() => {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotion.value = media.matches
  measure()
  if (root.value) {
    resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(root.value)
  }
  startRotation()
})

onBeforeUnmount(() => {
  stopRotation()
  resizeObserver?.disconnect()
})
</script>

<template>
  <div
    ref="root"
    class="relative w-full select-none overflow-hidden transition-[height] duration-500 ease-out"
    :style="stageStyle"
    @click.self="reset"
  >
    <!-- Ancla 0×0 en el centro de la órbita: todo lo absoluto se centra sobre ella -->
    <div class="absolute left-1/2 flex size-0 items-center justify-center" :style="centerStyle" @click.self="reset">
      <!-- Núcleo -->
      <div
        class="absolute z-10 flex size-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--metal-4),var(--metal-1))] shadow-[0_0_60px_var(--orbit-glow)]"
        @click.self="reset"
      >
        <span
          class="animate-ping-slow pointer-events-none absolute size-20 rounded-full border border-ink/25 opacity-70"
        />
        <span
          class="animate-ping-slow pointer-events-none absolute size-24 rounded-full border border-ink/15 opacity-50 [animation-delay:0.6s]"
        />
        <span class="flex size-9 items-center justify-center rounded-full bg-abyss/85 backdrop-blur-sm">
          <WLogo class="h-3.5 w-4 text-ink" />
        </span>
      </div>

      <!-- Anillo de la órbita -->
      <div class="pointer-events-none absolute rounded-full border border-ink/15" :style="ringStyle" />

      <!-- Fases -->
      <div
        v-for="node in nodes"
        :key="node.step.key"
        class="absolute flex flex-col items-center transition-all duration-700 ease-out"
        :style="node.style"
      >
        <button
          type="button"
          class="group flex cursor-pointer flex-col items-center focus:outline-none"
          :aria-expanded="node.isActive"
          :aria-label="stepLabel(node.step)"
          @click.stop="select(node.step.key)"
        >
          <!-- Halo -->
          <span
            class="pointer-events-none absolute left-1/2 top-1/2 size-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--orbit-glow)_0%,transparent_70%)] transition-opacity duration-500"
            :class="[
              node.isActive || node.isRelated ? 'opacity-100' : 'opacity-0 group-hover:opacity-70',
              node.isRelated && 'animate-pulse',
            ]"
          />

          <!-- Nodo -->
          <span
            class="relative flex size-10 items-center justify-center rounded-full border-2 transition-all duration-300 sm:size-11"
            :class="[
              node.isActive
                ? 'scale-125 border-jade bg-jade text-abyss shadow-[0_0_30px_var(--jade-glow)] sm:scale-150'
                : node.isRelated
                  ? 'animate-pulse border-jade/60 bg-jade/10 text-jade'
                  : 'border-ink/40 bg-graphite text-ink group-hover:border-jade group-hover:text-jade',
            ]"
          >
            <component :is="node.step.icon" class="size-4" :stroke-width="1.75" />
          </span>

          <!-- Etiqueta -->
          <span
            class="mt-2 whitespace-nowrap text-[0.65rem] font-semibold uppercase tracking-[0.2em] transition-all duration-300 sm:text-xs"
            :class="[
              node.isActive ? 'mt-4 scale-110 text-ink sm:mt-5' : 'text-ink/75 group-hover:text-ink',
              !node.isActive && 'max-sm:sr-only',
            ]"
          >
            {{ stepLabel(node.step) }}
          </span>
        </button>

        <!-- Tarjeta desplegada -->
        <Transition name="orbit-card">
          <div
            v-if="node.isActive"
            class="absolute top-[4.5rem] left-1/2 w-[min(17rem,calc(100vw-3rem))] -translate-x-1/2 cursor-default rounded-2xl border border-ink/20 bg-graphite/95 p-4 text-left shadow-[0_20px_60px_-20px_var(--color-veil)] backdrop-blur-lg sm:top-24 sm:w-72 sm:p-5"
            @click.stop
          >
            <span class="absolute -top-3 left-1/2 h-3 w-px -translate-x-1/2 bg-ink/40" />

            <div class="flex items-center justify-between gap-3 pr-6 sm:pr-0">
              <span
                class="rounded-full bg-ink px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-abyss"
              >
                {{ t('proceso.fase') }} {{ phaseNumber(node.index) }}
              </span>
              <span class="flex items-center gap-1 text-[0.7rem] text-ink/70">
                <Clock class="size-3" />
                {{ t(`proceso.pasos.${node.step.key}.duracion`) }}
              </span>
            </div>

            <h3 class="mt-3 text-base font-semibold text-ink">
              {{ stepLabel(node.step) }}
            </h3>
            <p class="mt-1.5 text-xs leading-relaxed text-ink/80">
              {{ t(`proceso.pasos.${node.step.key}.descripcion`) }}
            </p>

            <div class="mt-4 border-t border-ink/10 pt-3">
              <p class="flex items-center gap-1.5 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-ink/70">
                <PackageCheck class="size-3" />
                {{ t('proceso.entregable') }}
              </p>
              <p class="mt-1 text-xs text-ink/90">
                {{ t(`proceso.pasos.${node.step.key}.entregable`) }}
              </p>
            </div>

            <div v-if="node.step.related.length" class="mt-4 border-t border-ink/10 pt-3">
              <p class="flex items-center gap-1.5 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-ink/70">
                <Link2 class="size-3" />
                {{ t('proceso.relacionados') }}
              </p>
              <div class="mt-2 flex flex-wrap gap-1.5">
                <button
                  v-for="relKey in node.step.related"
                  :key="relKey"
                  type="button"
                  class="flex items-center gap-1 rounded-md border border-ink/15 px-2 py-1 text-[0.7rem] text-ink/85 transition-colors hover:border-ink/40 hover:bg-ink/5 hover:text-ink"
                  @click.stop="select(relKey)"
                >
                  {{ t(`proceso.pasos.${relKey}.titulo`) }}
                  <ArrowRight class="size-3" />
                </button>
              </div>
            </div>

            <button
              type="button"
              class="absolute right-3 top-3 rounded-full p-1 text-ink/60 transition-colors hover:bg-ink/10 hover:text-ink sm:hidden"
              :aria-label="t('proceso.cerrar')"
              @click.stop="reset"
            >
              <X class="size-3.5" />
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Tailwind v4 usa la propiedad `translate`, así que se anima esa y no `transform`. */
.orbit-card-enter-active,
.orbit-card-leave-active {
  transition:
    opacity 0.35s ease,
    translate 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    scale 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
.orbit-card-enter-from,
.orbit-card-leave-to {
  opacity: 0;
  translate: -50% -0.5rem;
  scale: 0.96;
}
</style>
