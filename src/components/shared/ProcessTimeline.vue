<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Clock, PackageCheck } from '@lucide/vue'
import type { ProcessStep } from '@/data'
import RevealOnScroll from './RevealOnScroll.vue'

/**
 * Línea de tiempo vertical del ciclo de desarrollo. En móvil la línea va a la
 * izquierda; desde `lg` se centra y las fases alternan de lado.
 */
defineProps<{
  steps: ProcessStep[]
}>()

const { t } = useI18n()
</script>

<template>
  <ol class="relative">
    <li
      v-for="(step, i) in steps"
      :key="step.key"
      class="relative grid grid-cols-[2.5rem_1fr] gap-x-4 lg:grid-cols-[1fr_4rem_1fr] lg:gap-x-8"
    >
      <!-- Columna del eje: punto + segmento que crece al revelarse -->
      <div class="relative flex justify-center lg:col-start-2">
        <RevealOnScroll class="flex h-full flex-col items-center">
          <span
            class="step-dot relative z-10 mt-6 flex size-10 items-center justify-center rounded-full border border-ink/20 bg-graphite font-display text-lg text-silver shadow-[0_0_0_6px_var(--color-abyss)]"
          >
            {{ String(i + 1).padStart(2, '0') }}
          </span>
          <span v-if="i < steps.length - 1" class="step-line mt-2 w-px flex-1 origin-top bg-ink/15" />
        </RevealOnScroll>
      </div>

      <!-- Contenido -->
      <div
        class="pb-12 lg:pb-16"
        :class="i % 2 === 0 ? 'lg:col-start-3 lg:row-start-1' : 'lg:col-start-1 lg:row-start-1 lg:text-right'"
      >
        <RevealOnScroll :delay="120">
          <article
            class="group rounded-2xl border border-ink/10 bg-ink/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-jade-soft/30 hover:bg-carbon/60 sm:p-7"
          >
            <div class="flex items-center gap-3" :class="i % 2 === 1 && 'lg:flex-row-reverse'">
              <span
                class="flex size-10 shrink-0 items-center justify-center rounded-xl border border-ink/10 bg-ink/5 text-silver transition-colors group-hover:border-jade-soft/40 group-hover:bg-jade/10 group-hover:text-jade"
              >
                <component :is="step.icon" class="size-5" :stroke-width="1.5" />
              </span>
              <h3 class="text-lg font-semibold text-ink">
                {{ t(`proceso.pasos.${step.key}.titulo`) }}
              </h3>
            </div>
            <p class="mt-3 text-sm leading-relaxed text-silver/65">
              {{ t(`proceso.pasos.${step.key}.descripcion`) }}
            </p>
            <div class="mt-4 flex flex-wrap gap-2 text-xs" :class="i % 2 === 1 && 'lg:justify-end'">
              <span class="flex items-center gap-1.5 rounded-full border border-ink/10 bg-ink/5 px-3 py-1 text-silver">
                <Clock class="size-3" />
                {{ t(`proceso.pasos.${step.key}.duracion`) }}
              </span>
              <span class="flex items-center gap-1.5 rounded-full border border-ink/10 bg-ink/5 px-3 py-1 text-silver">
                <PackageCheck class="size-3" />
                {{ t(`proceso.pasos.${step.key}.entregable`) }}
              </span>
            </div>
          </article>
        </RevealOnScroll>
      </div>
    </li>
  </ol>
</template>

<style scoped>
.step-line {
  transform: scaleY(0);
  transition: transform 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.25s;
}
.reveal.is-visible .step-line {
  transform: scaleY(1);
}
.step-dot {
  transition:
    border-color 0.4s ease,
    color 0.4s ease;
}
.reveal.is-visible .step-dot {
  border-color: color-mix(in oklab, var(--color-ink) 60%, transparent);
  color: var(--color-ink);
}
@media (prefers-reduced-motion: reduce) {
  .step-line {
    transform: none;
    transition: none;
  }
}
</style>
