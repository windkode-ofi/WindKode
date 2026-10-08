<script setup lang="ts">
import { MaskLines } from '@/components/motion'

withDefaults(
  defineProps<{
    kicker?: string
    title?: string
    subtitle?: string
    align?: 'left' | 'center' | 'split'
    /** Nivel del título: `h1` en la cabecera principal de cada página (SEO). */
    as?: 'h1' | 'h2'
    /** Número de sección opcional, se muestra como «(01) ——» antes del kicker. */
    index?: string
  }>(),
  { align: 'center', as: 'h2', kicker: undefined, title: undefined, subtitle: undefined, index: undefined },
)
</script>

<template>
  <div
    class="mb-14"
    :class="[
      align === 'center' && 'text-center',
      align === 'split' && 'flex flex-col gap-4 md:flex-row md:items-end md:justify-between',
    ]"
  >
    <div>
      <p
        v-if="kicker"
        class="mb-3 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.35em] text-steel"
        :class="align === 'center' && 'justify-center'"
      >
        <template v-if="index">
          <span class="tracking-normal text-jade-soft">({{ index }})</span>
          <span class="h-px w-8 bg-steel/40" />
        </template>
        {{ kicker }}
      </p>
      <!-- Con slot `title` el contenido es libre; si no, el título entra con máscara -->
      <component
        :is="as"
        v-if="$slots.title"
        class="font-display text-metal text-4xl uppercase leading-[0.95] sm:text-5xl md:text-7xl"
      >
        <slot name="title" />
      </component>
      <MaskLines
        v-else-if="title"
        :as="as"
        :lines="[title]"
        line-class="text-metal"
        class="font-display text-4xl uppercase leading-[0.95] sm:text-5xl md:text-7xl"
      />
      <p v-if="subtitle && align !== 'split'" class="mt-4 text-sm text-silver/60">
        {{ subtitle }}
      </p>
    </div>
    <p v-if="subtitle && align === 'split'" class="max-w-sm text-sm leading-relaxed text-silver/60">
      {{ subtitle }}
    </p>
  </div>
</template>
