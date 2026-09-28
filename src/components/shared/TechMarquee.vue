<script setup lang="ts">
import { WLogo } from '@/components/ui'
import { VelocityMarquee } from '@/components/motion'
import { marqueeItems } from '@/data'

/**
 * Dos cintas de tecnologías en sentidos opuestos (una sólida y otra en
 * contorno) que aceleran, se invierten y se inclinan con el scroll.
 */
const half = Math.ceil(marqueeItems.length / 2)
const rows = [
  { items: marqueeItems.slice(0, half), velocity: -2, outline: false },
  { items: marqueeItems.slice(half), velocity: 2, outline: true },
]
</script>

<template>
  <div class="relative -rotate-1 border-y border-ink/5 bg-abyss py-5 md:py-6">
    <div
      class="flex flex-col gap-2 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] md:gap-3"
    >
      <VelocityMarquee v-for="(row, r) in rows" :key="r" :base-velocity="row.velocity">
        <span
          v-for="item in row.items"
          :key="item"
          class="flex items-center gap-6 whitespace-nowrap pr-6 font-display text-3xl uppercase tracking-[0.08em] md:gap-8 md:pr-8 md:text-5xl"
          :class="row.outline ? 'text-outline' : 'text-silver/45'"
        >
          {{ item }}
          <WLogo class="h-4 w-5 shrink-0 text-jade-soft/70 md:h-5 md:w-6" />
        </span>
      </VelocityMarquee>
    </div>
  </div>
</template>
