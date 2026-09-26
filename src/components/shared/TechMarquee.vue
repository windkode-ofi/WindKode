<script setup lang="ts">
import { WLogo } from '@/components/ui'
import { marqueeItems } from '@/data'

/** Segundos por elemento: mantiene la velocidad constante aunque crezca la lista. */
const SECONDS_PER_ITEM = 2.8
const marqueeStyle = { animationDuration: `${marqueeItems.length * SECONDS_PER_ITEM}s` }
</script>

<template>
  <div class="relative border-y border-ink/5 py-5">
    <div class="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
      <div class="animate-marquee flex shrink-0 items-center gap-10 pr-10" :style="marqueeStyle">
        <template v-for="n in 2" :key="n">
          <span
            v-for="item in marqueeItems"
            :key="`${n}-${item}`"
            class="flex items-center gap-10 whitespace-nowrap font-display text-xl uppercase tracking-[0.25em] text-silver/40"
          >
            {{ item }}
            <WLogo class="h-4 w-5 text-jade-soft/60" />
          </span>
        </template>
      </div>
    </div>
  </div>
</template>
