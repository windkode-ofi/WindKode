<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { prefersReducedMotion, useScrollProgress } from '@/composables/useScrollProgress'
import type { StackLayerItem } from '@/data'

/**
 * Escena 3D ligera (solo CSS, sin WebGL): la pila de software que construimos,
 * una placa isométrica por capa (app, IA, integraciones, nube).
 *   - Las capas se separan al avanzar el scroll (--gap).
 *   - La escena se inclina hacia el cursor (--tx / --ty).
 *   - La capa activa se eleva y se ilumina; la leyenda y el hover la eligen,
 *     y si nadie interactúa va rotando sola.
 * Todo por variables CSS en el elemento: sin re-render por frame.
 */
const props = defineProps<{ layers: StackLayerItem[] }>()

const { t } = useI18n()

const stage = ref<HTMLElement | null>(null)
const active = ref(0)
const hovering = ref(false)
const progress = useScrollProgress(stage, [1, 0.55], 1)

watch(progress, (p) => stage.value?.style.setProperty('--gap', `${(26 + p * 58).toFixed(1)}px`))

/** Las placas se pintan de abajo (nube) arriba (app): orden inverso al de la leyenda. */
const plates = computed(() =>
  props.layers.map((layer, index) => ({ layer, index, z: props.layers.length - 1 - index })),
)

let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  if (prefersReducedMotion()) return
  timer = setInterval(() => {
    if (!hovering.value) active.value = (active.value + 1) % props.layers.length
  }, 2600)
})

onBeforeUnmount(() => clearInterval(timer))

function select(index: number) {
  active.value = index
  hovering.value = true
}

function onMove(e: PointerEvent) {
  const el = stage.value
  if (!el || e.pointerType !== 'mouse') return
  const r = el.getBoundingClientRect()
  el.style.setProperty('--tx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3))
  el.style.setProperty('--ty', ((e.clientY - r.top) / r.height - 0.5).toFixed(3))
}

function onLeave() {
  stage.value?.style.setProperty('--tx', '0')
  stage.value?.style.setProperty('--ty', '0')
  hovering.value = false
}
</script>

<template>
  <div class="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-6">
    <!-- Leyenda: texto real (indexable) que controla la capa activa -->
    <ol class="order-2 flex flex-col gap-2 lg:order-none" @pointerleave="hovering = false">
      <li v-for="(layer, i) in layers" :key="layer.key">
        <button
          type="button"
          class="group flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-all duration-500"
          :class="
            active === i
              ? 'border-jade-soft/40 bg-carbon/60 lg:translate-x-2'
              : 'border-ink/10 bg-transparent hover:border-ink/20'
          "
          :aria-pressed="active === i"
          @pointerenter="select(i)"
          @focus="select(i)"
          @click="select(i)"
        >
          <span
            class="flex size-11 shrink-0 items-center justify-center rounded-xl border transition-colors duration-500"
            :class="active === i ? 'border-jade-soft/40 text-jade' : 'border-ink/10 text-silver'"
          >
            <component :is="layer.icon" class="size-5" :stroke-width="1.5" />
          </span>
          <span class="flex-1">
            <span class="block font-semibold text-ink">{{ t(`home.arquitectura.capas.${layer.key}.titulo`) }}</span>
            <span class="block text-sm text-silver/60">{{ t(`home.arquitectura.capas.${layer.key}.detalle`) }}</span>
          </span>
          <span class="font-display text-2xl transition-colors" :class="active === i ? 'text-jade/60' : 'text-ink/10'">
            0{{ i + 1 }}
          </span>
        </button>
      </li>
    </ol>

    <!-- Escena 3D -->
    <div
      ref="stage"
      class="stack-stage order-1 lg:order-none"
      aria-hidden="true"
      @pointermove="onMove"
      @pointerleave="onLeave"
    >
      <div class="stack-float">
        <div class="stack-scene">
          <div class="stack-shadow" />
          <div
            v-for="plate in plates"
            :key="plate.layer.key"
            class="stack-layer"
            :class="{ 'is-active': active === plate.index }"
            :style="{ '--z': plate.z }"
            @pointerenter="select(plate.index)"
          >
            <div class="stack-plate">
              <!-- App: ventana de navegador con interfaz -->
              <div v-if="plate.layer.key === 'app'" class="flex h-full flex-col gap-2">
                <div class="flex gap-1">
                  <span v-for="n in 3" :key="n" class="size-1.5 rounded-full bg-ink/25" />
                </div>
                <div class="h-3 w-2/3 rounded bg-ink/15" />
                <div class="grid flex-1 grid-cols-2 gap-2">
                  <div class="stack-shimmer rounded-lg bg-ink/[0.07]" />
                  <div class="stack-shimmer rounded-lg bg-ink/[0.07]" style="animation-delay: -1.2s" />
                </div>
                <div class="h-3 w-1/3 rounded-full bg-jade-soft/60" />
              </div>

              <!-- IA: red neuronal que late -->
              <svg v-else-if="plate.layer.key === 'ia'" viewBox="0 0 100 100" class="size-full">
                <g class="stroke-ink/20" stroke-width="0.8">
                  <line x1="18" y1="25" x2="50" y2="18" /><line x1="18" y1="25" x2="50" y2="50" />
                  <line x1="18" y1="75" x2="50" y2="50" /><line x1="18" y1="75" x2="50" y2="82" />
                  <line x1="50" y1="18" x2="82" y2="50" /><line x1="50" y1="50" x2="82" y2="50" />
                  <line x1="50" y1="82" x2="82" y2="50" />
                </g>
                <g class="fill-ink/40">
                  <circle cx="18" cy="25" r="4" /><circle cx="18" cy="75" r="4" />
                  <circle cx="50" cy="18" r="4" /><circle cx="50" cy="82" r="4" />
                </g>
                <circle cx="50" cy="50" r="5" class="stack-pulse fill-jade-soft" />
                <circle cx="82" cy="50" r="5" class="stack-pulse fill-jade-soft" style="animation-delay: -0.8s" />
              </svg>

              <!-- Integraciones: código -->
              <div v-else-if="plate.layer.key === 'apis'" class="flex h-full flex-col justify-center gap-2 font-mono">
                <span class="text-sm leading-none text-jade-soft">{ }</span>
                <span
                  v-for="(w, n) in ['75%', '55%', '85%', '40%', '65%']"
                  :key="n"
                  class="stack-shimmer h-2 rounded-full bg-ink/15"
                  :style="{ width: w, marginLeft: n % 2 ? '12%' : '0', animationDelay: `${-n * 0.4}s` }"
                />
              </div>

              <!-- Nube: servidores con leds -->
              <div v-else class="flex h-full flex-col justify-center gap-2.5">
                <div
                  v-for="n in 3"
                  :key="n"
                  class="flex items-center gap-2 rounded-lg border border-ink/10 bg-ink/[0.05] px-3 py-2.5"
                >
                  <span class="stack-led size-1.5 rounded-full bg-jade-soft" :style="{ animationDelay: `${-n * 0.5}s` }" />
                  <span class="size-1.5 rounded-full bg-ink/25" />
                  <span class="ml-auto h-1.5 w-1/2 rounded-full bg-ink/15" />
                </div>
              </div>

              <span class="stack-label">
                <component :is="plate.layer.icon" class="size-3.5" :stroke-width="1.75" />
                {{ t(`home.arquitectura.capas.${plate.layer.key}.titulo`) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
