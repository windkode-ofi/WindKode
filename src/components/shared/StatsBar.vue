<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { CountUp } from '@/components/motion'
import { stats } from '@/data'

const { t } = useI18n()
</script>

<template>
  <div class="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-ink/10 bg-ink/5 lg:grid-cols-4">
    <div
      v-for="stat in stats"
      :key="stat.labelKey"
      class="group flex flex-col items-center gap-2 bg-abyss px-4 py-8 text-center transition-colors hover:bg-jade/[0.06] md:px-6 md:py-10"
    >
      <CountUp :value="stat.value" class="font-display text-metal text-4xl sm:text-5xl md:text-6xl" />
      <span class="text-xs uppercase tracking-[0.25em] text-silver/50 transition-colors group-hover:text-jade">
        {{ t(stat.labelKey) }}
      </span>
    </div>
  </div>
</template>
